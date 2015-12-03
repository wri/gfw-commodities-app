<?php
require('../../../../vendor/autoload.php');
$bucket=getenv('bucket');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try{
      $s3 = Aws\S3\S3Client::factory();

      $uploads = array();
      if(isset($_FILES['dataFile'])){
        print_r('sss')
        $upload = json_encode(uploadFile($bucket, $_FILES['dataFile']));
        array_push($upload,$uploads);
        print_r($upload);
      }
      if(isset($_FILES['attributeFile'])){
        $upload2 = json_encode(uploadFile($bucket, $_FILES['attributeFile']));
        array_push($upload2,$uploads);
      }

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
