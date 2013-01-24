## anvil.plato
This extension adds static analysis of your JavaScript files using the Plato library. The generated report is output to a ./report folder by default.

## Usage
You can run the analysis as part of your build by providing the --plato argument or by including the following property in your build file:

{
	"anvil.plato": {
		"analyze": true
	}
}

## Output
You can change the default output directory through the build file:

{
	"anvil.plato": {
		"output": "./plato"
	}
}

## Viewing The Report
If you provide the --host flag, plato output will be automatically hosted at /plato and will auto-refresh if you're also in --ci mode.