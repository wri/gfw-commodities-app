<?php
require('../../../../vendor/autoload.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
      $s3 = Aws\S3\S3Client::factory();

      $urls = "";
      $bucket=getenv('bucket');
      if(isset($_FILES['dataFile'])){


        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $_FILES['dataFile']['name'],
            'SourceFile'   => $_FILES['dataFile']['tmp_name'],
            'ACL'          => 'public-read'
        ));
        $urls = $urls . $result['ObjectURL'];

      }
      if(isset($_FILES['attributeFile'])){
        //$upload = $s3->upload($bucket, $_FILES['attributeFile']['name'], fopen($_FILES['attributeFile']['tmp_name'], 'rb'), 'public-read');
        //array_push($upload2,$uploads);

        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $_FILES['attributeFile']['name'],
            'SourceFile'   => $_FILES['attributeFile']['tmp_name'],
            'ACL'          => 'public-read'
        ));
        $urls = $urls . ";" . $result['ObjectURL'];

      }
      print_r($urls);

  } catch (S3Exception $e) {
      echo "ERROR" . $e->getMessage() . "\n";
  }

} else {
  echo("Sorry, you're not allowed to do this.");
}


?>
