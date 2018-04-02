#! /usr/bin/env node

var program = require('commander');
const { spawn } = require('child_process');

let logString = '';
// let checkAuthorList = ['']

let formatTime = (time) => {
  let dateTime = new Date(time)
  return `${dateTime.getFullYear()}-${dateTime.getMonth()+1}-${dateTime.getDate()}`
}

let getLog = (option) => {
  const options = ['log', '--pretty=format:"%ad %an %s"']
  if (option && option.before) { // 指定时间之后
    options.push(`--before=${option.before}`)
  }
  if (option && option.after) { // 指定时间之后
    options.push(`--since=${option.after}`)
  }
  const ls = spawn('git', options);
  ls.stdout.on('data', data => {
    logString += data.toString()
  })
  ls.stdout.on('close', data => {
    let array = logString.split(/\n+/);

    // 去掉无关文件的修改记录
    array = array.filter(log => {
      const keyWord = ['readme', 'finance.md', 'Merge']
      return keyWord.every(word => log.indexOf(word) === -1)
    })
    // 筛选作者
    if (option && option.author) {
      array = array.filter(log => {
        return log.indexOf(option.author) !== -1
      })
    }
    // 格式化最后显示
    let array2 = array.map(list => {
      return list.replace(/(.*\s*\+0800)(\s*.*)/g ,function (match, p1, p2) {
        return `${formatTime(p1)}${p2}`
      })
    })
    console.log(array2)
  })
}
program
  .command('list')
  .option('-b, --before [date]', 'before the date')
  .option('-a, --after [date]', 'after the date')
  .option('-n, --author [author]', 'the author name')  
  .description('show the log list')
  .action(function(option) {
    const ls = spawn('git', ['pull'])
    ls.stdout.on('close',() => {
      getLog(option)
    })
  })
program.parse(process.argv);
