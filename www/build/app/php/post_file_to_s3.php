<?php
require('../../../../vendor/autoload.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try{

      $s3 = Aws\S3\S3Client::factory();
      $file = $_FILES['file'];
      $dataFileName = $_POST["dataFileName"];
      $dataFileType = $_POST["dataFileType"];
      $bucket=getenv('bucket');
      $upload = $s3->upload($bucket, $_FILES['file']['name'], fopen($_FILES['file']['tmp_name'], 'rb'), 'public-read');
      print_r($upload);
      // $result = $s3->putObject(array(
      //   'Bucket' => $bucket,
      //   'Key'    => $file['name'],
      //   'Body'   => $file['tmp_name'],
      //   'ACL'    => 'public-read'
      // ));
  } catch (S3Exception $e) {
      echo "ERROR" . $e->getMessage() . "\n";
  }



} else {
  echo("Sorry, you're not allowed to do this.");
}

?>
