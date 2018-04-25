var Parent = React.createClass({
	render: function(){
		return (
			<div>
				<div> This is the parent. </div>
				<Chid name = 'child' />
			</div>
		)
	}
})