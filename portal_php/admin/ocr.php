<?php
/* Direct URL alias, consistent with FocusBrain /admin/*.php navigation. */
require_once dirname(__DIR__).'/lib.php';
require_admin();
header('Location: ../index.php?page=admin_ocr',true,302);exit;
