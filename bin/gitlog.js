var program = require('commander');
const { spawn } = require('child_process');

let logString = ''
let checkAuthorList = [''] 
program
  .command('list')
  .option('-b, --before [date]', 'before the date')
  .option('-a, --after [date]', 'after the date')
  .option('-n, --author [author]', 'the author name')  
  .description('show the log list')
  .action(function(option) { 
  	const options = ['log', '--pretty=format:"%ad %an %s"']
  	if (option && option.before) { // 指定时间之后
  	  options.push(`--before=${option.before}`) 
  	} 
	  if (option && option.after) { // 指定时间之后
  	  options.push(`--since=${option.after}`) 
  	}
    const ls = spawn('git', options);
	  ls.stdout.on('data', (data) => {   
      logString += data.toString()
    }) 
    ls.stdout.on('close', (data) => {   
      let array = logString.split(/\n+/)  
      if (option && option.author) { 
        array = array.filter((log) => {
          return log.indexOf(option.author) !== -1
        })
      } 
      console.log(array)
    }) 
    
  })
program.parse(process.argv);
