<?php
require('../../../../vendor/autoload.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
      $s3 = Aws\S3\S3Client::factory();

      $urls = array();
      $bucket=getenv('bucket');
      if(isset($_FILES['dataFile'])){



        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $_FILES['dataFile']['name'],
            'SourceFile'   => $_FILES['dataFile']['tmp_name'],
            'ACL'          => 'public-read'
        ));



        // $upload = $s3->upload($bucket, $_FILES['dataFile']['name'], fopen($_FILES['dataFile']['tmp_name'], 'rb'), 'public-read');
        // print_r($upload[1]);
        print_r($result['ObjectURL']);
        // print_r($upload[1]['ObjectURL']);
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
