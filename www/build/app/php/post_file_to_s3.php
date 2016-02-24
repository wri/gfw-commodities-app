<?php
require('../../../../vendor/autoload.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
      $s3 = Aws\S3\S3Client::factory();

      $urls = "";
      $bucket=getenv('bucket');
      $key=getenv('aws_access_key_id');
      $secret=getenv('aws_secret_access_key');


      if(isset($_FILES['dataFile'])){


        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $_FILES['dataFile']['name'],
            'SourceFile'   => $_FILES['dataFile']['tmp_name']
        ));
        $urls = $urls . $result['ObjectURL'];

      }
      if(isset($_FILES['attributeFile'])){
        //$upload = $s3->upload($bucket, $_FILES['attributeFile']['name'], fopen($_FILES['attributeFile']['tmp_name'], 'rb'), 'public-read');
        //array_push($upload2,$uploads);

        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $_FILES['attributeFile']['name'],
            'SourceFile'   => $_FILES['attributeFile']['tmp_name']
        ));

        $urls = $urls . ";" . $result['ObjectURL'];

        // $signedUrl = $s3->getObjectUrl($bucket, $_FILES['attributeFile']['name'], '+15 minutes');

      }

      $client = Aws\Ses\SesClient::factory(array(
          'key'    => $key,
          'secret' => $secret,
          'region' => 'us-east-1'
      ));

      $msg = array();
      $msg['Source'] = "lcotner@blueraster.com";
      //ToAddresses must be an array
      $msg['Destination']['ToAddresses'][] = "jhettmansperger@blueraster.com";
      $msg['Message']['Subject']['Data'] = "Email from S3 PHP SDK";
      $msg['Message']['Subject']['Charset'] = "UTF-8";
      $msg['Message']['Body']['Text']['Data'] = "The bodyyy";
      $msg['Message']['Body']['Text']['Charset'] = "UTF-8";
      $msg['Message']['Body']['Html']['Data'] = "<h3>HTML</h3> <p>Data of email</p>";
      $msg['Message']['Body']['Html']['Charset'] = "UTF-8";

      $client->sendEmail($msg);

      print_r($urls);




      // $obj = new stdClass();
      // $obj->URL = $urls;
      // $obj->SIGNED_URL = $signedUrl;

      // print_r($obj);
      // print_r({$urls);
      // print_r('{URL:' & $urls & ',SIGNED_URL:' & $signedUrl);

  } catch (S3Exception $e) {
      echo "ERROR" . $e->getMessage() . "\n";
  }

} else {
  echo("Sorry, you're not allowed to do this.");
}


?>
