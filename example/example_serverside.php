<?php

require("../PiG.php");

class MyPIG extends PiG
{
	var $maintainTime = 10;
	var $pollTime = 2;
	
	function CheckCondition()
	{
		return 1 == rand(0, 20);
	}
	
	/*
	 *	Called when we need to return something useful
	 *
	 */
	function Respond()
	{
		echo "Pushed it real good";
		die();
	}
}

$testPush = new MyPiG();

?>
