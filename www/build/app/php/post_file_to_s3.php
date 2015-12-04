<?php
require('../../../../vendor/autoload.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
      $s3 = Aws\S3\S3Client::factory();
      print_r('finally');
      $bucket=getenv('bucket');
      $uploads = array();
      if(isset($_FILES['dataFile'])){
        print_r('In the If');
        $upload = json_encode(uploadFile($bucket, $_FILES['dataFile']));
        array_push($upload,$uploads);
        print_r($upload);
      }else{
        print_r("Never Made it in");
      }
      // if(isset($_FILES['attributeFile'])){
      //   $upload2 = json_encode(uploadFile($bucket, $_FILES['attributeFile']));
      //   array_push($upload2,$uploads);
      //}

  } catch (S3Exception $e) {
      echo "ERROR" . $e->getMessage() . "\n";
  }

} else {
  echo("Sorry, you're not allowed to do this.");
}
//
// function uploadFile($bucket,$file){
//     $upload = $s3->upload($bucket, $file['name'], fopen($file['tmp_name'], 'rb'), 'public-read');
// }

?>
