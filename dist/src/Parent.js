var Parent = React.createClass({displayName: "Parent",
	render: function(){
		return (
			React.createElement("div", null, 
				React.createElement("div", null, " This is the parent. "), 
				React.createElement(Chid, {name: "child"})
			)
		)
	}
})