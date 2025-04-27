<?php
    header('Content-Type: text/plain; charset=utf-8'); // Set header for plain text response

    // --- CONFIGURATION ---
    $recipient_email = "your_email@example.com"; // <<<=== PUT YOUR EMAIL ADDRESS HERE
    $subject_prefix = "[Wow Makers Contact Form]";
    // --- END CONFIGURATION ---

    $error_message = '';
    $success_message = "Thank you! Your message has been sent successfully. We'll be in touch soon.";

    // Function to sanitize input data
    function sanitize_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        return $data;
    }

    // Check if the form was submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        // Honeypot check (basic anti-spam)
        if (!empty($_POST['website'])) {
            // If honeypot field is filled, it's likely a bot
            http_response_code(400); // Bad request
            die("Spam detected."); // Stop script execution
        }

        // Get and sanitize form data
        $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
        $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
        $company = isset($_POST['company']) ? sanitize_input($_POST['company']) : '';
        $phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
        $event_type = isset($_POST['event_type']) ? sanitize_input($_POST['event_type']) : '';
        $message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

        // Basic Validation
        if (empty($name)) {
            $error_message .= "Name is required.\n";
        }
        if (empty($email)) {
            $error_message .= "Email is required.\n";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error_message .= "Invalid email format.\n";
        }
        if (empty($message)) {
            $error_message .= "Message is required.\n";
        }

        // If no errors, proceed to send email
        if (empty($error_message)) {
            $email_subject = "$subject_prefix New Inquiry from $name";

            $email_body = "You have received a new message from your website contact form.\n\n";
            $email_body .= "Here are the details:\n\n";
            $email_body .= "Name: $name\n";
            $email_body .= "Email: $email\n";
            if (!empty($company)) {
                $email_body .= "Company: $company\n";
            }
            if (!empty($phone)) {
                $email_body .= "Phone: $phone\n";
            }
             if (!empty($event_type)) {
                $email_body .= "Event Type: $event_type\n";
            }
            $email_body .= "\nMessage:\n$message\n";

            // Email Headers
            $headers = "From: $name <$email>\r\n";
            $headers .= "Reply-To: $email\r\n";
            $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion();

            // --- Attempt to send email ---
            // IMPORTANT: The mail() function might not work reliably on all servers,
            // especially shared hosting or local development environments without proper configuration.
            // Consider using PHPMailer or an email API service (SendGrid, Mailgun) for production.
            if (mail($recipient_email, $email_subject, $email_body, $headers)) {
                // --- Success ---
                // Option 1: Output success message directly (if using AJAX to submit)
                 // echo json_encode(['success' => true, 'message' => $success_message]);

                // Option 2: Redirect to a thank-you page (simpler for non-AJAX forms)
                 header('Location: contact.html?status=success'); // Redirect back with success status
                 exit; // Important to prevent further script execution after redirect

            } else {
                // --- Mail Function Error ---
                $error_message = "Sorry, there was an error sending your message. Please try again later or contact us directly via email.";
                 // Option 1 (AJAX):
                 // http_response_code(500); // Internal Server Error
                 // echo json_encode(['success' => false, 'message' => $error_message]);

                 // Option 2 (Redirect):
                 header('Location: contact.html?status=error&msg=' . urlencode($error_message));
                 exit;
            }
        } else {
             // --- Validation Error ---
             // Option 1 (AJAX):
             // http_response_code(400); // Bad Request
             // echo json_encode(['success' => false, 'message' => nl2br($error_message)]); // Send errors back

             // Option 2 (Redirect):
             header('Location: contact.html?status=validation_error&msg=' . urlencode($error_message));
             exit;
        }

    } else {
        // Not a POST request, redirect or show error
        http_response_code(405); // Method Not Allowed
        echo "Invalid request method.";
        // Or redirect: header('Location: contact.html'); exit;
    }
    ?>
