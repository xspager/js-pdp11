var TKS, TPS, keybuf = [];

function
clearterminal()
{
	var len = document.getElementById("terminal").firstChild.nodeValue.length;
	document.getElementById("terminal").firstChild.deleteData(0, len);
	TKS = 0;
	TPS = 1<<7;
}

function
writeterminal(msg)
{
	document.getElementById("terminal").firstChild.appendData(msg);
}

function
addchar(c)
{
	TKS |= 0x80;
	keybuf.splice(0, 0, c);
}

function
getchar()
{
	if(TKS & 0x80) {
		TKS &= 0xff7e;
		return keybuf.pop();
	}
	return 0;
}

function
consread16(a)
{
	switch(a) {
	case 0777560: return TKS;
	case 0777562: return getchar();
	case 0777564: return TPS;
	}
	panic("read from invalid address " + ostr(a,6));
}

function
conswrite16(a,v)
{
	switch(a) {
	case 0777564:
		if(v & (1<<6))
			TPS |= 1<<6;
		else
			TPS &= ~(1<<6);
		break;
	case 0777566:
		v &= 0xFF;
		if(!(TPS & 0x80)) break;
		writeterminal(String.fromCharCode(v));
		TPS &= 0xff7f;
		setTimeout("TPS |= 0x80;", 10);
		break;
	default:
		panic("write to invalid address " + ostr(a,6));
	}
}
