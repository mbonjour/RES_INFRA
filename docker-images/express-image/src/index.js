var express = require('express')
var axios = require('axios')
var Chance = require('chance')
var chance = new Chance()
var ip = require('ip')
var app = express()

app.get('/test', (req, res) => {
	res.send("Testing...")
})

app.get('/', (req, res) =>{
	var randomID = chance.integer({
		min: 1,
		max: 25
	})

	axios.get('https://api.punkapi.com/v2/beers').then((res2)=>{
		obj = res2.data[randomID]
		obj.ip = ip.address()
		res.send(obj)
	})
})

app.listen(3000, () => {
	console.log("Yes i am listening on port 3000");
})

