module.exports = {
	user_id: 'abc123',
	auth: {
		"object":"page",
		"entry":[
		{
			"id":'PAGE_ID',
			"time":12341,
			"messaging":[
			{
				"sender":{
					"id":'abc123'
				},
				"recipient":{
					"id":'PAGE_ID'
				},
				"timestamp":1234567890,
				"optin":{
					"ref":"PASS_THROUGH_PARAM"
				}
			}
			]
		}
		]
	},
	text: {
		"object":"page",
		"entry":[
		{
			"id":'PAGE_ID',
			"time":1457764198246,
			"messaging":[
			{
				"sender":{
					"id":'abc123'
				},
				"recipient":{
					"id":'PAGE_ID'
				},
				"timestamp":1457764197627,
				"message":{
					"mid":"mid.1457764197618:41d102a3e1ae206a38",
					"seq":73,
					"text":"hello, world!"
				}
			}
			]
		}
		]
	},
	media: {
		"object":"page",
		"entry":[
		{
			"id":'PAGE_ID',
			"time":1458696618911,
			"messaging":[
			{
				"sender":{
					"id":'abc123'
				},
				"recipient":{
					"id":'PAGE_ID'
				},
				"timestamp":1458696618268,
				"message":{
					"mid":"mid.1458696618141:b4ef9d19ec21086067",
					"seq":51,
					"attachments":[
					{
						"type":"image",
						"payload":{
							"url":"IMAGE_URL"
						}
					}
					]
				}
			}
			]
		}
		]
	},
	delivered: {
		"object":"page",
		"entry":[
		{
			"id":'PAGE_ID',
			"time":1458668856451,
			"messaging":[
			{
				"sender":{
					"id":'abc123'
				},
				"recipient":{
					"id":'PAGE_ID'
				},
				"delivery":{
					"mids":[
					"mid.1458668856218:ed81099e15d3f4f233"
					],
					"watermark":1458668856253,
					"seq":37
				}
			}
			]
		}
		]
	},
	postback: {
		"object":"page",
		"entry":[
		{
			"id":'PAGE_ID',
			"time":1458692752478,
			"messaging":[
			{
				"sender":{
					"id":'abc123'
				},
				"recipient":{
					"id":'PAGE_ID'
				},
				"timestamp":1458692752478,
				"postback":{
					"payload":"USER_DEFINED_PAYLOAD"
				}
			}
			]
		}
		]
	}
};