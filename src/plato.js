var plato,
	path = require( "path" );

module.exports = function( _, anvil ) {
	anvil.plugin( {
		name: "plato",
		description: "plato code analysis tool",
		activity: "post-build",
		config: {
			output: "./report"
		},

		configure: function( config, command, done ) {
			anvil.http.registerPath( "/plato", this.config.output );
			done();
		},

		run: function( done, activity ) {
			var self = this;
			if( !plato ) {
				plato = require( "plato" );
			}
			var options = { recurse: true };
			if( this.config.name ) {
				options[ name ] = this.config.name;
			}
			if( this.config.jshint ) {
				options[ jshint ] = this.config.jshint;
			}

			plato.inspect(
				[ anvil.config.source ],
				this.config.output,
				options,
				function() { self.rewriteHtml( done ); }
			);
		},

		rewriteHtml: function( done ) {
			var self = this;
			anvil.fs.getFiles( this.config.output, this.config.output, function( files ) {
				anvil.scheduler.parallel( files, function( file, done ) {
					if( file.extension() === ".html" ) {
						var transform = function( content, done ) {
							var level = file.relativePath.split( path.sep ).length;
							self.transformLinks( level, content, done );
						};
						anvil.fs.transform( file.fullPath, transform, file.fullPath, function() { done(); } );
					} 
					else if( file.name.match( /report[.]js$/ ) ) {
						anvil.fs.transform( file.fullPath, self.updateJson, file.fullPath, function() { done(); } );
					} else {
						done();
					}
				}, function() { done(); } );
			} );
		},

		transformLinks: function( level, content, done ) {
			var report = level > 2 ? "./report" : "/plato/report",
				newContent = content
				.replace( /link href[=]["].*assets/g, 'link href="/plato/assets' )
				.replace( /src[=]["].*assets/g, 'src="/plato/assets' )
				.replace( /src[=]["]report/g, 'src="' + report )
				.replace( /href[=]["][.][\/]file/g, 'href="plato/file' )
				.replace( /href[=]["].*["][>]Report Home[<]/g, 'href="/plato">Report Home<' );
			done( newContent );
		},

		updateJson: function( content, done ) {
			var newContent = content
				.replace( /["]link["][:] ["]files/g, '"link": "plato/files' );
			done( newContent );
		}
	} );
};