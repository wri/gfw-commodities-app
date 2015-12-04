<?php
require('../../../../vendor/autoload.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
      $s3 = Aws\S3\S3Client::factory();
      print_r('finally');
      $bucket=getenv('bucket');
      $uploads = array();
      if(isset($_FILES['dataFile'])){
        $upload = $s3->upload($bucket, $_FILES['dataFile']['name'], fopen($_FILES['dataFile']['tmp_name'], 'rb'), 'public-read');
        array_push($upload,$uploads);
        print_r(json_encode($upload));
        print_r(json_encode($uploads));
      }
      if(isset($_FILES['attributeFile'])){
        $upload = $s3->upload($bucket, $_FILES['attributeFile']['name'], fopen($_FILES['attributeFile']['tmp_name'], 'rb'), 'public-read');
        //array_push($upload2,$uploads);
      }

  } catch (S3Exception $e) {
      echo "ERROR" . $e->getMessage() . "\n";
  }

} else {
  echo("Sorry, you're not allowed to do this.");
}


?>
