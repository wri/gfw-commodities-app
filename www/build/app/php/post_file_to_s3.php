<?php
require('../../../../vendor/autoload.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try{
      print_r('Here');
      $s3 = Aws\S3\S3Client::factory();
      $file = $_FILES['file'];
      $dataFileName = $_POST["dataFileName"];
      $dataFileType = $_POST["dataFileType"];
      $bucket=getenv('bucket');
      
      print_r($file['name']);
      print_r($file['tmp_name']);
      // $result = $s3->putObject(array(
      //   'Bucket' => $bucket,
      //   'Key'    => $file['name'],
      //   'Body'   => $file['tmp_name'],
      //   'ACL'    => 'public-read'
      // ));
  } catch (S3Exception $e) {
      echo $e->getMessage() . "\n";
  }

  // $upload = $s3->upload($bucket, $_FILES['userfile']['name'], fopen($_FILES['userfile']['tmp_name'], 'rb'), 'public-read');

} else {
  echo("Sorry, you're not allowed to do this.");
}

?>
