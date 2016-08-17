<?php
require('../../../../vendor/autoload.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
      $s3 = Aws\S3\S3Client::factory();

      $sesClient = Aws\Ses\SesClient::factory(array(
          'credentials' => array(
              'key'    => getenv('AWS_ACCESS_KEY_ID'),
              'secret' => getenv('AWS_SECRET_ACCESS_KEY'),
          ),
          // 'version' => 'latest',
          'region' => 'us-east-1',
      ));


      $urls = "";
      $bucket=getenv('bucket');
      if(isset($_FILES['concessionFile'])){

        $concessionFileName = $_POST['storyCompany'] . "/concessions/" . $_FILES['concessionFile']['name'];
        // 'Key'          => $_FILES['concessionFile']['name'],
        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $concessionFileName,
            'Body'   => $_FILES['concessionFile']['tmp_name'],
            'ACL'          => 'public-read'
        ));
        $urls = $urls . $result['ObjectURL'];
      }
      if(isset($_FILES['facilityFile'])){

        $facilityFileName = $_POST['storyCompany'] . "/concessions/" . $_FILES['facilityFile']['name'];

        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $facilityFileName,
            'Body'   => $_FILES['facilityFile']['tmp_name'],
            'ACL'          => 'public-read'
        ));
        $urls = $urls . ";" . $result['ObjectURL'];
      }
      if(isset($_FILES['otherFile'])){

        $otherFileName = $_POST['storyCompany'] . "/concessions/" . $_FILES['otherFile']['name'];

        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $otherFileName,
            'Body'   => $_FILES['otherFile']['tmp_name'],
            'ACL'          => 'public-read'
        ));
        $urls = $urls . ";" . $result['ObjectURL'];
      }

      $messageBody = "<p>The file " . $_FILES['concessionFile']['name'] . " was uploaded by " . $_POST['storyUserName'] . ".</p><p>They can be reached at <a href='" . $_POST['storyEmail'] . "'>" . $_POST['storyEmail'] . "</a>.</p>";

      $email_result = $sesClient->sendEmail(array(
          // Source is required
          'Source' => 'lcotner@blueraster.com', //aallegretti@blueraster.com
          // Destination is required
          'Destination' => array(
              'ToAddresses' => array('psatlof@blueraster.com'),
              'CcAddresses' => array('lcotner@blueraster.com')
          ),
          // Message is required
          'Message' => array(
              // Subject is required
              'Subject' => array(
                  // Data is required
                  'Data' => 'GFW Commodities Data Submission',
                  'Charset' => 'UTF-8',
              ),
              // Body is required
              'Body' => array(
                  'Text' => array(
                      // Data is required
                      'Data' => 'The body',
                      'Charset' => 'UTF-8',
                  ),
                  'Html' => array(
                      // Data is required
                      'Data' => $messageBody,
                      'Charset' => 'UTF-8',
                  ),
              ),
          )
      ));

      print_r($_POST['concessionFileName']);
      // print_r($credentials);
      // print_r($email_result);
      // print_r($urls);

  } catch (S3Exception $e) {
      echo "ERROR" . $e->getMessage() . "\n";
  }

} else {
  echo("Sorry, you're not allowed to do this.");
}


?>
