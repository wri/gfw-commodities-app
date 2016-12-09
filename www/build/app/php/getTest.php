<?php
try {
  $URL = "http://localhost/";
  $data = file_get_contents($URL);
  echo 'succes: ' . $data;
} catch(Exception $e) {
  echo 'Message: ' .$e->getMessage();
}

?>
