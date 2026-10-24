<?php
if(!defined('PORTAL_VIEW_ROUTER'))exit;must_can($u,'smtp');
title('SMTP Mail Center','Quản lý máy chủ SMTP, mã hóa mật khẩu ứng dụng và kiểm tra gửi thư.');
panel('Cấu hình SMTP');form_open('save_smtp');foreach(['smtp_host'=>'SMTP Host','smtp_port'=>'Cổng','smtp_user'=>'Tài khoản','smtp_from'=>'Địa chỉ gửi','smtp_from_name'=>'Tên hiển thị'] as $key=>$label)inputf($label,$key,(string)pref($key),$key==='smtp_port'?'number':'text','required');
inputf('Mật khẩu ứng dụng (bỏ trống để giữ nguyên)','smtp_password','','password','autocomplete="new-password"');submitf('Lưu cấu hình');echo '</section>';
panel('Gửi thư thử');form_open('test_smtp');inputf('Email nhận thư thử','to',$u['email'],'email','required');submitf('Gửi email kiểm tra');echo '</section>';
