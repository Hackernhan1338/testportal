<?php
require_once dirname(__DIR__).'/lib.php';require_admin();
$id=(int)($_GET['id']??0);header('Location: ../index.php?page=admin_qr&id='.$id,true,302);exit;
