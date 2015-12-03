<?php
require('../../../../vendor/autoload.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try{
      $s3 = Aws\S3\S3Client::factory();
      $bucket=getenv('bucket');
      $uploads = array();
      if(isset($_FILES['dateFile'])){
        $upload = uploadFile($bucket, $_FILES['dateFile']);
        array_push($upload,$uploads);
      }
      if(isset($_FILES['attributeFile'])){
        $upload2 = uploadFile($bucket, $_FILES['attributeFile']);
        array_push($upload2,$uploads);
      }
      print_r($uploads);

  } catch (S3Exception $e) {
      echo "ERROR" . $e->getMessage() . "\n";
  }
} else {
  echo("Sorry, you're not allowed to do this.");
}

function uploadFile($bucket,$file){
    $upload = $s3->upload($bucket, $file['name'], fopen($file['tmp_name'], 'rb'), 'public-read');
}

?>
