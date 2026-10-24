<?php
require_once dirname(__DIR__).'/lib.php';
require_admin();
header('Location: ../index.php?page=admin_tasks',true,302);exit;
