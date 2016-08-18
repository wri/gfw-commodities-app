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
          'region' => 'us-east-1',
      ));

      $messageBody = "";
      $bucket=getenv('bucket');
      if(isset($_FILES['concessionFile'])){

        // $file = new SplFileInfo($_FILES['concessionFile']['name']);
        // $extension = $file->getExtension();
        // $pure_name = $file->getBasename('.' . $extension);

        // todo: our filenames are incorrect: we need to remove the .shp or .** from our $_FILES[..]['name']
        // and append it at the end, somehow keeping the file type correct

        // $concessionFileName = rename($_FILES['concessionFile']['name'], 'lucas.csv');
        // $concessionFileName = rename($_FILES['concessionFile']['name'], $_POST['storyCompany'] . "/concessions/" . $pure_name . "_" . $_POST['datestring'] . "." . $extension);
        // $concessionFileName = $_POST['storyCompany'] . "/concessions/" . $pure_name . "_" . $_POST['datestring'] . "." . $extension;

        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $_FILES['concessionFile'],
            // 'Body'   => $_FILES['concessionFile']['tmp_name'],
            'SourceFile'   => $_FILES['concessionFile']['name'],
            'ACL'          => 'public-read'
        ));

        $concessionInfo = $concessionFileName . '_info.txt';
        $concessionBody = $_POST['storyUserName'] . "\r\n" . $_POST['storyCompany'] . "\r\n" . $_POST['storyTitle'] . "\r\n" . $_POST['storyEmail'];

        $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $concessionInfo,
            'Body'         => $concessionBody,
            'ACL'          => 'public-read'
        ));

        $messageBody = $messageBody . "<p>The file <a href='" . $result['ObjectURL'] . "'>" . $_FILES['concessionFile']['name'] . "</a>"  . " was uploaded by " . $_POST['storyUserName'] . ".</p>";
      }
      if(isset($_FILES['facilityFile'])){

        $facilityFileName = $_POST['storyCompany'] . "/facilities/" . $_FILES['facilityFile']['name'] . "_" . $_POST['datestring'];

        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $facilityFileName,
            'Body'   => $_FILES['facilityFile']['tmp_name'],
            'ACL'          => 'public-read'
        ));

        $facilityInfo = $facilityFileName . '_info.txt';
        $facilityBody = $_POST['storyUserName'] . "\r\n" . $_POST['storyCompany'] . "\r\n" . $_POST['storyTitle'] . "\r\n" . $_POST['storyEmail'];

        $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $facilityInfo,
            'Body'         => $facilityBody,
            'ACL'          => 'public-read'
        ));

        $messageBody = $messageBody . "<p>The file <a href='" . $result['ObjectURL'] . "'>" . $_FILES['facilityFile']['name'] . "</a>"  . " was uploaded by " . $_POST['storyUserName'] . ".</p>";
      }
      if(isset($_FILES['otherFile'])){

        $otherFileName = $_POST['storyCompany'] . "/other/" . $_FILES['otherFile']['name'] . "_" . $_POST['datestring'];

        $result = $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $otherFileName,
            'Body'   => $_FILES['otherFile']['tmp_name'],
            'ACL'          => 'public-read'
        ));

        $otherInfo = $otherFileName . '_info.txt';
        $otherBody = $_POST['storyUserName'] . "\r\n" . $_POST['storyCompany'] . "\r\n" . $_POST['storyTitle'] . "\r\n" . $_POST['storyEmail'];

        $s3->putObject(array(
            'Bucket'       => $bucket,
            'Key'          => $otherInfo,
            'Body'         => $otherBody,
            'ACL'          => 'public-read'
        ));

        $messageBody = $messageBody . "<p>The file <a href='" . $result['ObjectURL'] . "'>" . $_FILES['otherFile']['name'] . "</a>"  . " was uploaded by " . $_POST['storyUserName'] . ".</p>";
      }

      $messageBody = $messageBody . "<p>They can be reached at <a href='mailto:" . $_POST['storyEmail'] . "'>" . $_POST['storyEmail'] . "</a>.</p>";
      // $messageBody = "<p>The file <a href='" . $_FILES['concessionFile']['name'] . "'>" . $_FILES['concessionFile']['name'] . "</a>"  . " was uploaded by " . $_POST['storyUserName'] . ".</p><p>They can be reached at <a href='mailto:" . $_POST['storyEmail'] . "'>" . $_POST['storyEmail'] . "</a>.</p>";

      $email_result = $sesClient->sendEmail(array(
          // Source is required
          'Source' => 'data@wri.org', //todo: change to WRI_data_something
          // Destination is required
          'Destination' => array(
              'ToAddresses' => array('lcotner@blueraster.com')//, //ssargent@wri.org
              // 'CcAddresses' => array('lcotner@blueraster.com') //caroline.winchester@wri.org
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

      print_r($messageBody);

  } catch (S3Exception $e) {
      echo "ERROR" . $e->getMessage() . "\n";
  }

} else {
  echo("Sorry, you're not allowed to do this.");
}

?>
