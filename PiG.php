<?php

class PiG
{
	var $maintainTime = 20;
	var $pollTime = 5;
	var $time;
	
	function PiG()
	{
		// support for algorithmic changing of open connection time (managed on client side)
		if(isset($_GET["maintainTime"]))
		{
			$this->maintainTime = $_GET["maintainTime"];
		}
		$this->time = time();
		
		$this->Poll();
	}
	
	function Poll()
	{
		if($this->CheckCondition())
		{
			$this->Respond();
		}
		else if(time() >= $this->time + $this->maintainTime)
		{
			$this->ReOpen();
		}
		else
		{
			sleep($this->pollTime);
			$this->Poll();
		}
	}
	
	function ReOpen()
	{
		header("HTTP/1.0 204 No Response");
		die();
	}
	
	// override in subclass to make it work
	
	function CheckCondition()
	{
		return true;
	}
	
	function Respond()
	{
		echo "true";
		die();
	}
}
?>
