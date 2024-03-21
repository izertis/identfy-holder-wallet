import { danger, fail, markdown, message } from 'danger'

const fs = require('fs')
const path = require('path')

const jiraIssue = require('danger-plugin-jira-issue').default
const filter = require('lodash').filter

const getPylintMarkdown = (pylintOutput, files) => {
  let pylintMarkdown = '## Pylint Issues:\n<details>\n  <summary>Issues</summary>\n\n'
  let warnings = false

  files.map(file => {
    const records = filter(pylintOutput, function (record) {
      if (record.path.includes(file)) {
        return true
      } else {
        return false
      }
    })

    if (records.length > 0) {
      warnings = true

      pylintMarkdown = pylintMarkdown.concat('  ').concat(file).concat('\n')
      records.map(record => {
        pylintMarkdown = pylintMarkdown.concat(
          `  * ${record.symbol} - ${record.message} Line ${record.line} \n`
        )
      })
      pylintMarkdown = pylintMarkdown.concat('\n')
    }
  })

  pylintMarkdown = pylintMarkdown.concat('</details>')

  if (warnings) {
    return pylintMarkdown
  } else {
    return ''
  }
}

const existsChangelog = fs.existsSync('CHANGELOG.md')

if (!existsChangelog) {
  fail('Create a changelog file following the instructions of [KeepaChangelog](https://keepachangelog.com/en/1.0.0/)')
} else {
  const hasChangelogModified = danger.git.modified_files.includes('CHANGELOG.md')

  if (!hasChangelogModified) {
    fail('Please add a changelog entry for your changes and follow the instructions of [KeepaChangelog](https://keepachangelog.com/en/1.0.0/)')
  }
}

jiraIssue({
  key: 'ID',
  url: 'https://wealize.atlassian.net/browse',
  emoji: ':paperclip:',
  location: 'title'
})

if (fs.existsSync('pylint.json')) {
  const pylintOutput = JSON.parse(fs.readFileSync('pylint.json', 'utf8'))

  if (danger.git.modified_files.length > 0 || danger.git.created_files.length > 0) {
    const modifiedFiles = danger.git.modified_files.map(pathname => {
      return path.parse(pathname).base
    })

    const newFiles = danger.git.created_files.map(pathname => {
      return path.parse(pathname).base
    })

    const files = newFiles.concat(modifiedFiles)

    const messageToSend = getPylintMarkdown(pylintOutput, files)

    if (messageToSend !== '') {
      markdown(messageToSend)
    } else {
      message('There aren\'t pylint errors in your code :rocket:')
    }
  }
} 