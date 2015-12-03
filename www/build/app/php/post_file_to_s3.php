<?php

  // echo(getenv( $bucket ));

  echo($_ENV["bucket"]);
// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $file = $_POST["file"];
  $dataFileName = $_POST["dataFileName"];
  $dataFileType = $_POST["dataFileType"];

  $bucket=getenv('bucket');
  echo($bucket);

// } else {
//   echo("Sorry, you're not allowed to do this.");
// }

?>
