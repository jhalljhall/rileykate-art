<?php

//Fetching Values from URL
$name 			= $_POST['ajax_name'];
$email_from 	= $_POST['ajax_email'];
$email_to		= $_POST['ajax_emailto'];
$message 		= $_POST['ajax_message'];
$phone	 		= $_POST['ajax_tel'];



//Sanitizing email
$email_from 	= filter_var($email_from, FILTER_SANITIZE_EMAIL);
$email_to 		= filter_var($email_to, FILTER_SANITIZE_EMAIL);


//After sanitization Validation is performed
if (filter_var($email_from, FILTER_VALIDATE_EMAIL)) {
	
	
		$subject = "Message from contact form Persono";
		
		// To send HTML mail, the Content-type header must be set
		$php_headers = 'MIME-Version: 1.0' . "\r\n";
		$php_headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
		$php_headers .= 'From:' . $email_from. "\r\n"; // Sender's Email
		$php_headers .= 'Cc:' . $email_from. "\r\n"; // Carbon copy to Sender
		
		$php_template = '<div style="padding:50px;">Hello ' . $name . ',<br/>'
		. 'Thank you for contacting us.<br/><br/>'
		. '<strong style="color:#f00a77;">Name:</strong>  ' . $name . '<br/>'
		. '<strong style="color:#f00a77;">Email:</strong>  ' . $email_from . '<br/>'
		. '<strong style="color:#f00a77;">Subject:</strong>  ' . $subject . '<br/>'
		. '<strong style="color:#f00a77;">Phone:</strong>  ' . $phone . '<br/>'
		. '<strong style="color:#f00a77;">Message:</strong>  ' . $message . '<br/><br/>'
		. 'This is a Contact Confirmation mail.'
		. '<br/>'
		. 'We will contact you as soon as possible .</div>';
		$message = "<div style=\"background-color:#f5f5f5; color:#333;\">" . $php_template . "</div>";
		
		// message lines should not exceed 70 characters (PHP rule), so wrap it
		$message = wordwrap($message, 70);
		
		// Send mail by PHP Mail Function
		mail($email_to, $subject, $message, $php_headers);
		echo '';
	
}else if(filter_var($email_to, FILTER_VALIDATE_EMAIL)){
	echo "<span class='contact_error'>* Invalid recipient email *</span>";
} else {
	echo "<span class='contact_error'>* Invalid sender email *</span>";
}

?>