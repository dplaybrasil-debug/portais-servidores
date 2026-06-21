<?php
// save_apps.php – recebe o JSON dos apps via POST e sobrescreve o arquivo apps.json
$input = file_get_contents('php://input');
if ($input === false || strlen($input) === 0) {
    http_response_code(400);
    echo 'Nenhum conteúdo recebido.';
    exit;
}
if (file_put_contents('apps.json', $input) === false) {
    http_response_code(500);
    echo 'Falha ao salvar o arquivo.';
    exit;
}
header('Content-Type: text/plain');
echo 'OK';
?>
