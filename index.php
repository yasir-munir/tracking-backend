<?php
http_response_code(401);
echo json_encode(array("message" => "Unauthorized"));