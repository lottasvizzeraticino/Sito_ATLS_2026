<?php
declare(strict_types=1);
// Endpoint per PHP 8+, da pubblicare sullo stesso dominio del sito.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function respond(int $status, string $message, bool $ok = false): never {
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, 'Metodo non consentito.');
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) respond(413, 'Richiesta troppo lunga.');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origin && parse_url($origin, PHP_URL_HOST) !== explode(':', $host)[0]) respond(403, 'Origine non consentita.');
$raw = file_get_contents('php://input', false, null, 0, 20001);
if ($raw === false || strlen($raw) > 20000) respond(413, 'Richiesta troppo lunga.');
$data = json_decode($raw, true);
if (!is_array($data)) respond(400, 'Formato non valido.');
foreach ($data as $value) if (!is_string($value)) respond(400, 'Valori non validi.');
if (trim($data['website'] ?? '') !== '') respond(400, 'Richiesta non valida.');
$type = $data['type'] ?? '';
if (!in_array($type, ['membership', 'event'], true)) respond(400, 'Richiesta non valida.');
$required = ['nome', 'cognome', 'email', 'consenso'];
if ($type === 'membership') $required = array_merge($required, ['tipo_membro', 'via', 'cap', 'luogo', 'quota', 'data', 'firma']);
else $required = array_merge($required, ['evento', 'data_evento', 'orario', 'luogo_evento', 'durata', 'informazioni', 'telefono']);
foreach ($required as $key) if (trim($data[$key] ?? '') === '') respond(422, 'Compila tutti i campi obbligatori.');
if (($data['consenso'] ?? '') !== 'Confermato') respond(422, 'Conferma il trattamento dei dati.');
$email = trim($data['email']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email)) respond(422, 'Email non valida.');
foreach ($data as $key => $value) {
    $max = $key === 'informazioni' ? 4000 : 500;
    if (strlen($value) > $max * 4) respond(422, 'Un campo supera la lunghezza consentita.');
}
if ($type === 'membership') {
    if (!in_array($data['tipo_membro'], ['Membro passivo', 'Sostenitore'], true)) respond(422, 'Tipo di membro non valido.');
    $minimum = $data['tipo_membro'] === 'Sostenitore' ? 50 : 20;
    if (!is_numeric($data['quota']) || (float)$data['quota'] < $minimum || (float)$data['quota'] > 100000) respond(422, 'Contributo non valido.');
}
foreach (['data', 'data_evento', 'nascita'] as $key) {
    if (!empty($data[$key])) {
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $data[$key]);
        if (!$date || $date->format('Y-m-d') !== $data[$key]) respond(422, 'Data non valida.');
    }
}
// Limite per IP, senza conservare i dati del formulario.
$ratePath = sys_get_temp_dir() . '/atls-form-' . hash('sha256', (__DIR__) . ($_SERVER['REMOTE_ADDR'] ?? 'unknown')) . '.json';
$rateFile = fopen($ratePath, 'c+');
if (!$rateFile || !flock($rateFile, LOCK_EX)) respond(503, 'Servizio momentaneamente non disponibile.');
$attempts = json_decode(stream_get_contents($rateFile) ?: '[]', true);
$attempts = array_values(array_filter(is_array($attempts) ? $attempts : [], fn($t) => is_int($t) && $t > time() - 3600));
if (count($attempts) >= 5) { flock($rateFile, LOCK_UN); fclose($rateFile); respond(429, 'Troppe richieste. Riprova più tardi oppure scrivici via email.'); }
$attempts[] = time(); rewind($rateFile); ftruncate($rateFile, 0); fwrite($rateFile, json_encode($attempts)); flock($rateFile, LOCK_UN); fclose($rateFile);
$labels = ['tipo_membro'=>'Tipo di adesione', 'cognome'=>'Cognome', 'nome'=>'Nome', 'via'=>'Via e numero', 'cap'=>'CAP', 'luogo'=>'Luogo', 'nascita'=>'Data di nascita', 'natel'=>'Natel', 'telefono'=>'Telefono', 'email'=>'Email', 'quota'=>'Contributo annuale CHF', 'data'=>'Data della richiesta', 'firma'=>'Nome digitato per conferma', 'evento'=>'Evento', 'data_evento'=>'Data evento', 'orario'=>'Orario indicativo', 'luogo_evento'=>'Luogo evento', 'durata'=>'Durata desiderata', 'pubblico'=>'Pubblico previsto', 'informazioni'=>'Informazioni', 'consenso'=>'Consenso'];
$body = "Richiesta dal sito ATLS\n\n";
foreach ($labels as $key => $label) if (isset($data[$key])) $body .= $label . ': ' . trim($data[$key]) . "\n";
$to = $type === 'membership' ? 'crotta@bluewin.ch' : 'info@lottasvizzera.ch';
$subject = $type === 'membership' ? 'ATLS - Richiesta di adesione' : 'ATLS - Richiesta evento';
$headers = ['From'=>'ATLS <info@lottasvizzera.ch>', 'Reply-To'=>$email, 'MIME-Version'=>'1.0', 'Content-Type'=>'text/plain; charset=UTF-8'];
if (!mail($to, $subject, $body, $headers)) respond(503, 'Invio non riuscito. Scrivici via email.');
respond(200, 'Richiesta affidata al servizio email.', true);
