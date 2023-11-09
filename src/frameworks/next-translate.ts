import { TextDocument } from 'vscode'
import { Framework, ScopeRange } from './base'
import { LanguageId } from '~/utils'

class NextTranslateFramework extends Framework {
  id= 'next-translate'
  display= 'Next Translate'

  detection= {
    packageJSON: [
      'next-translate',
    ],
  }

  languageIds: LanguageId[] = [
    'javascript',
    'typescript',
    'javascriptreact',
    'typescriptreact',
    'ejs',
  ]

  // for visualize the regex, you can use https://regexper.com/
  usageMatchRegex = [
    '[^\\w\\d]t\\([\'"`]({key})[\'"`]',
    '[^\\w\\d]t`({key})`',
    'Trans\\s+i18nKey=[\'"`]({key})[\'"`]',
  ]

  refactorTemplates(keypath: string) {
    return [
      `{t('${keypath}')}`,
      `t('${keypath}')`,
      keypath,
    ]
  }

  rewriteKeys(key: string) {
    return key.replace(/:/g, '.')
  }

  // useTranslation
  getScopeRange(document: TextDocument): ScopeRange[] | undefined {
    if (![
      'javascript',
      'typescript',
      'javascriptreact',
      'typescriptreact',
    ].includes(document.languageId))
      return

    const ranges: ScopeRange[] = []
    const text = document.getText()
    const reg = /useTranslation\((?:['"`](.*)['"`]|)\)/g

    for (const match of text.matchAll(reg)) {
      if (match?.index == null)
        continue

      // end previous scope
      if (ranges.length)
        ranges[ranges.length - 1].end = match.index

      // start new scope if namespace provides
      if (match[1]) {
        ranges.push({
          start: match.index,
          end: text.length,
          namespace: match[1] as string,
        })
      }
    }

    return ranges
  }

  pathMatcher() {
    return '{locale}/{namespace}.json'
  }

  preferredKeystyle = 'nested' as const

  enableFeatures = {
    namespace: true,
  }
}

export default NextTranslateFramework
