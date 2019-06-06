<?php
	$ip_static = explode(";", getenv('STATIC_APP'));
	$ip_dynamic = explode(";", getenv('DYNAMIC_APP'));
?>

<VirtualHost *:80>
	
	<Proxy balancer://clusterStatic>
		<?php 
			foreach ($ip_static as $static) {
				print "BalancerMember http://" . $static . "\n\t\t";
			}
		?>
	</Proxy>
	<Proxy balancer://clusterDynamic>
		<?php
			foreach ($ip_dynamic as $dynamic) {
				print "BalancerMember http://" . $dynamic . "\n\t\t";
			}
		?>
	</Proxy>

	ProxyPreserveHost On

	ServerName demo.res.ch

	ProxyPass "/api/beer" balancer://clusterDynamic/
	ProxyPassReverse "/api/beer" balancer://clusterDynamic/

	ProxyPass "/" balancer://clusterStatic/
	ProxyPassReverse "/" balancer://clusterStatic/

</VirtualHost>

# vim: syintax=apache td=4 sw=4 ss=4 sr noet
