<?php
require('../../../../vendor/autoload.php');

  echo($_ENV["bucket"]);
// if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  // $s3 = Aws\S3\S3Client::factory();
  $file = $_POST["file"];
  $dataFileName = $_POST["dataFileName"];
  $dataFileType = $_POST["dataFileType"];

  $bucket=getenv('bucket');
  echo($bucket);

// } else {
//   echo("Sorry, you're not allowed to do this.");
// }

?>
