// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import { codeExport as exporter } from '@seleniumhq/side-utils'
import location from './location'
import selection from './selection'

export const emitters = {
  addSelection: emitSelect,
  answerOnNextPrompt: skip,
  assert: emitAssert,
  assertAlert: emitAssertAlert,
  assertChecked: emitVerifyChecked,
  assertConfirmation: emitAssertAlert,
  assertEditable: emitVerifyEditable,
  assertElementPresent: emitVerifyElementPresent,
  assertElementNotPresent: emitVerifyElementNotPresent,
  assertNotChecked: emitVerifyNotChecked,
  assertNotEditable: emitVerifyNotEditable,
  assertNotSelectedValue: emitVerifyNotSelectedValue,
  assertNotText: emitVerifyNotText,
  assertPrompt: emitAssertAlert,
  assertSelectedLabel: emitVerifySelectedLabel,
  assertSelectedValue: emitVerifyValue,
  assertValue: emitVerifyValue,
  assertText: emitVerifyText,
  assertTitle: emitVerifyTitle,
  check: emitCheck,
  chooseCancelOnNextConfirmation: skip,
  chooseCancelOnNextPrompt: skip,
  chooseOkOnNextConfirmation: skip,
  click: emitClick,
  clickAt: emitClick,
  close: emitClose,
  debugger: skip,
  do: emitControlFlowDo,
  doubleClick: emitDoubleClick,
  doubleClickAt: emitDoubleClick,
  dragAndDropToObject: emitDragAndDrop,
  echo: emitEcho,
  editContent: emitEditContent,
  else: emitControlFlowElse,
  elseIf: emitControlFlowElseIf,
  end: emitControlFlowEnd,
  executeScript: emitExecuteScript,
  executeAsyncScript: emitExecuteAsyncScript,
  forEach: emitControlFlowForEach,
  if: emitControlFlowIf,
  mouseDown: emitMouseDown,
  mouseDownAt: emitMouseDown,
  mouseMove: emitMouseMove,
  mouseMoveAt: emitMouseMove,
  mouseOver: emitMouseMove,
  mouseOut: emitMouseOut,
  mouseUp: emitMouseUp,
  mouseUpAt: emitMouseUp,
  open: emitOpen,
  pause: emitPause,
  removeSelection: emitSelect,
  repeatIf: emitControlFlowRepeatIf,
  run: emitRun,
  runScript: emitRunScript,
  select: emitSelect,
  selectFrame: emitSelectFrame,
  selectWindow: emitSelectWindow,
  sendKeys: emitSendKeys,
  setSpeed: emitSetSpeed,
  setWindowSize: emitSetWindowSize,
  store: emitStore,
  storeAttribute: emitStoreAttribute,
  storeJson: emitStoreJson,
  storeText: emitStoreText,
  storeTitle: emitStoreTitle,
  storeValue: emitStoreValue,
  storeWindowHandle: emitStoreWindowHandle,
  storeXpathCount: emitStoreXpathCount,
  submit: emitSubmit,
  times: emitControlFlowTimes,
  type: emitType,
  uncheck: emitUncheck,
  verify: emitAssert,
  verifyChecked: emitVerifyChecked,
  verifyEditable: emitVerifyEditable,
  verifyElementPresent: emitVerifyElementPresent,
  verifyElementNotPresent: emitVerifyElementNotPresent,
  verifyNotChecked: emitVerifyNotChecked,
  verifyNotEditable: emitVerifyNotEditable,
  verifyNotSelectedValue: emitVerifyNotSelectedValue,
  verifyNotText: emitVerifyNotText,
  verifySelectedLabel: emitVerifySelectedLabel,
  verifySelectedValue: emitVerifyValue,
  verifyText: emitVerifyText,
  verifyTitle: emitVerifyTitle,
  verifyValue: emitVerifyValue,
  waitForElementEditable: emitWaitForElementEditable,
  waitForElementPresent: emitWaitForElementPresent,
  waitForElementVisible: emitWaitForElementVisible,
  waitForElementNotEditable: emitWaitForElementNotEditable,
  waitForElementNotPresent: emitWaitForElementNotPresent,
  waitForElementNotVisible: emitWaitForElementNotVisible,
  webdriverAnswerOnVisiblePrompt: emitAnswerOnNextPrompt,
  waitForText: emitWaitForText,
  webdriverChooseCancelOnVisibleConfirmation: emitChooseCancelOnNextConfirmation,
  webdriverChooseCancelOnVisiblePrompt: emitChooseCancelOnNextConfirmation,
  webdriverChooseOkOnVisibleConfirmation: emitChooseOkOnNextConfirmation,
  while: emitControlFlowWhile,
}

exporter.register.preprocessors(emitters)

function register(command, emitter) {
  exporter.register.emitter({ command, emitter, emitters })
}

function emit(command) {
  return exporter.emit.command(command, emitters[command.command], {
    variableLookup,
    emitNewWindowHandling,
  })
}

function canEmit(commandName) {
  return !!emitters[commandName]
}

function variableLookup(varName) {
  return `$this->vars["${varName}"]`
}

function variableSetter(varName, value) {
  return varName ? `$this->vars["${varName}"] = ${value}` : ''
}

function emitWaitForWindow() {
  const generateMethodDeclaration = name => {
    return {
      body: `public function ${name}($timeout = 5) {`,
      terminatingKeyword: '}',
    }
  }
  return Promise.resolve('$I->switchToWindow("Selenium IDE");')
}

async function emitNewWindowHandling(command, emittedCommand) {
  const commands = [
    {level: 0, statement: `{`},
    {level: 1, statement: '$handles = $I->getWindowHandles();'},
    {level: 1, statement: `$command = ${command.windowHandleName};`},
    {level: 1, statement: `$timeout = ${command.windowTimeout};`},
    {level: 1, statement: `$lastWindow = end($handles);`},
    {level: 1, statement: `$webdriver->switchTo()->window($lastWindow);`},
    {level: 1, statement: `$webdriver->switchTo()->window($lastWindow);`},
    {level: 1, statement: `$webdriver->switchTo()->window($lastWindow);`},
    {level: 0, statement: `}`}
  ]

  return Promise.resolve(commands);
}

function emitAssert(varName, value) {
  return Promise.resolve(`$I->assert($this->vars["${varName}"] == "${value}");`)
}

function emitAssertAlert(alertText) {
  return Promise.resolve(
    `$I->assert($I->switchTo()->alert()->getText() == "${alertText}");`
  )
}

function emitAnswerOnNextPrompt(textToSend) {
  const commands = [
    { level: 0, statement: `{` },
      { level: 1, statement: '$alert = $I->switchTo().alert();' },
      { level: 1, statement: `$alert->endKeys("${textToSend}");` },
      { level: 1, statement: '$alert->accept()' },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitCheck(locator) {
  const commands = [
    {
      level: 1,
      statement: `{`,
    },
    {
      level: 2,
      statement: `$element = $I->findElement(${await location.emit(
        locator
      )});`,
    },
    { level: 1, statement: '$I->waitForElementClickable($element);' },
    {
      level: 2,
      statement: 'if (!($element->isSelected())) $element->click();',
    },
    { level: 1, statement: 'unset($element);' },
    {
      level: 1,
      statement: `}`,
    },
  ]
  return Promise.resolve({ commands })
}

function emitChooseCancelOnNextConfirmation() {
  return Promise.resolve(`$I->switchTo()->alert()->dismiss();`)
}

function emitChooseOkOnNextConfirmation() {
  return Promise.resolve(`$I->switchTo()->alert()->accept();`)
}

async function emitClick(target) {
  const commands = [
    { level: 2, statement: `{` },
    { level: 1, statement: `$I->waitForElementClickable("${target}");` },
    { level: 1, statement: `$I->click("${target}");` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitClose() {
  return Promise.resolve(`$I->close();`)
}

function generateExpressionScript(script) {
  return `$I->executeScript("return (${
    script.script
  })"${generateScriptArguments(script)});`
}

function generateScriptArguments(script) {
  return `${script.argv.length ? ', ' : ''}${script.argv
    .map(varName => `$this-vars["${varName}"]`)
    .join(',')}`
}

function emitControlFlowDo() {
  return Promise.resolve({
    commands: [{ level: 0, statement: 'do {' }],
    endingLevelAdjustment: 1,
  })
}

function emitControlFlowElse() {
  return Promise.resolve({
    commands: [{ level: 0, statement: '} else {' }],
    startingLevelAdjustment: -1,
    endingLevelAdjustment: +1,
  })
}

function emitControlFlowElseIf(script) {
  return Promise.resolve({
    commands: [
      {
        level: 0,
        statement: `} else if (!!${generateExpressionScript(script)}) {`,
      },
    ],
    startingLevelAdjustment: -1,
    endingLevelAdjustment: +1,
  })
}

function emitControlFlowEnd() {
  return Promise.resolve({
    commands: [{ level: 0, statement: `}` }],
    startingLevelAdjustment: -1,
  })
}

function emitControlFlowIf(script) {
  return Promise.resolve({
    commands: [
      { level: 0, statement: `if (!!${generateExpressionScript(script)}) {` },
    ],
    endingLevelAdjustment: 1,
  })
}

function emitControlFlowForEach(collectionVarName, iteratorVarName) {
  return Promise.resolve({
    commands: [
      {
        level: 2,
        statement: `$collection = $this->vars["${collectionVarName}"]`,
      },
      {
        level: 2,
        statement: `foreach ($collection as $index => $collectionItem) {`,
      },
      {
        level: 3,
        statement: `$this->vars["${iteratorVarName}"] = $this->vars["${collectionVarName}"][$index]`,
      },
    ],
  })
}

function emitControlFlowRepeatIf(script) {
  return Promise.resolve({
    commands: [
      {
        level: 2,
        statement: `} while(!!${generateExpressionScript(script)});`,
      },
    ],
    startingLevelAdjustment: -1,
  })
}

function emitControlFlowTimes(target) {
  const commands = [
    {
      level: 2,
      statement: `$times = ${target}`,
    },
    {
      level: 0,
      statement: `foreach($times as $time) {`,
    },
  ]
  return Promise.resolve({ commands, endingLevelAdjustment: 1 })
}

function emitControlFlowWhile(script) {
  return Promise.resolve({
    commands: [
      { level: 2, statement: `while(!!${generateExpressionScript(script)}) {` },
    ],
    endingLevelAdjustment: 1,
  })
}

async function emitDoubleClick(target) {
  const commands = [
    { level: 2, statement: `{` },
    { level: 1, statement: `$I->waitForElementClickable("${target}");` },
    { level: 1, statement: `$I->doubleClick("${target}");` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitDragAndDrop(dragged, dropped) {
  const commands = [
    { level: 0, statement: `{` },
    { level: 0, statement: `$I->dragAndDrop("${dragged}", "${dropped}");` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitEcho(message) {
  const _message = message.startsWith('$vars[') ? message : `"${message}"`
  return Promise.resolve(`$I->comment(${_message});`)
}

async function emitEditContent(locator, content) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$element = $I->findElement(${await location.emit(
        locator
      )});`,
    },
    {
      level: 1,
      statement: `$I->appendField($element, "${content}");`,
    },
    { level: 1, statement: 'unset($element);' },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitExecuteScript(script, varName) {
  const scriptString = script.script.replace(/`/g, '\\`')
  const result = `$I->executeJS("${scriptString}"${generateScriptArguments(
    script
  )});`
  return Promise.resolve(variableSetter(varName, result))
}

async function emitExecuteAsyncScript(script, varName) {
  const result = `$I->executeAsyncJS("var callback = arguments[arguments.length - 1];${
    script.script
  }.then(callback).catch(callback);${generateScriptArguments(script)}");`
  return Promise.resolve(variableSetter(varName, result))
}

async function emitMouseDown(locator) {
  const commands = [
    { level: 0, statement: `{` },
    { level: 1, statement: `$I->waitForElementClickable("${locator}");` },
    { level: 1, statement: `$I->clickAndHold("${locator}");` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitMouseMove(locator) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$element = $I->findElement(${await location.emit(
        locator
      )});`,
    },
    {
      level: 1,
      statement: '$I->moveToElement($element);',
    },
    { level: 1, statement: 'unset($element);' },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitMouseOut() {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$element = $I->findElement(By::CSS_SELECTOR, "body");`,
    },
    {
      level: 1,
      statement:
        '$I->moveToElement($element, 0, 0);',
    },
    { level: 1, statement: 'unset($element);' },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitMouseUp(locator) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$element = $I->findElement(${await location.emit(
        locator
      )});`,
    },
    {
      level: 1,
      statement:
        '$I->release($element);',
    },
    { level: 1, statement: 'unset($element);' },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

function emitOpen(target) {
  const url = /^(file|http|https):\/\//.test(target)
    ? `"${target}"`
    : `"${global.baseUrl}${target}"`
  return Promise.resolve(`$I->amOnUrl(${url});`)
}

async function emitPause(time) {
  const commands = [{ level: 0, statement: `$I->sleep(${time});` }]
  return Promise.resolve({ commands })
}

async function emitRun(testName) {
  return Promise.resolve(`${exporter.parsers.sanitizeName(testName)}();`)
}

async function emitRunScript(script) {
  return Promise.resolve(
    `$I->executeScript("${script.script}${generateScriptArguments(
      script
    )}");`
  )
}

async function emitSetWindowSize(size) {
  const [width, height] = size.split('x')
  return Promise.resolve(
    `$I->resizeWindow(${width}, ${height});`
  )
}

async function emitSelect(selectElement, option) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$dropdown = $I->findElement(${await location.emit(
        selectElement
      )});`,
    },
    {
      level: 1,
      statement: `$dropdown.findElement(${await selection.emit(
        option
      )})->click();`,
    },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitSelectFrame(frameLocation) {
  if (frameLocation === 'relative=top' || frameLocation === 'relative=parent') {
    return Promise.resolve('$I->switchTo().defaultContent()')
  } else if (/^index=/.test(frameLocation)) {
    return Promise.resolve(
      `$I->switchTo().frame(${Math.floor(
        frameLocation.split('index=')[1]
      )});`
    )
  } else {
    return Promise.resolve({
      commands: [
        { level: 0, statement: `{` },
        {
          level: 0,
          statement: `$element = $I->findElement(${await location.emit(
            frameLocation
          )});`,
        },
        { level: 0, statement: '$I->switchTo().frame(element)' },
        { level: 0, statement: `}` },
      ],
    })
  }
}

async function emitSelectWindow(windowLocation) {
  if (/^handle=/.test(windowLocation)) {
    return Promise.resolve(
      `$I->switchTo()->window(${windowLocation.split('handle=')[1]});`
    )
  } else if (/^name=/.test(windowLocation)) {
    return Promise.resolve(
      `$I->switchTo()->window("${windowLocation.split('name=')[1]}");`
    )
  } else if (/^win_ser_/.test(windowLocation)) {
    if (windowLocation === 'win_ser_local') {
      return Promise.resolve({
        commands: [
          {
            level: 0,
            statement:
              '$I->switchTo()->window($I->getAllWindowHandles()[0])',
          },
        ],
      })
    } else {
      const index = parseInt(windowLocation.substr('win_ser_'.length))
      return Promise.resolve({
        commands: [
          {
            level: 0,
            statement: `$I->switchTo()->window($I->getAllWindowHandles()[${index}]);`,
          },
        ],
      })
    }
  } else {
    return Promise.reject(
      new Error('Can only emit `select window` using handles')
    )
  }
}

function generateSendKeysInput(value) {
  if (typeof value === 'object') {
    return value
      .map(s => {
        if (s.startsWith('$this->vars[')) {
          return s
        } else if (s.startsWith('Key[')) {
          const key = s.match(/\['(.*)'\]/)[1]
          return `Key::${key}`
        } else {
          return `${s}`
        }
      })
      .join(', ')
  } else {
    if (value.startsWith('$this->vars[')) {
      return value
    } else {
      return `"${value}"`
    }
  }
}

async function emitSendKeys(target, value) {
  return Promise.resolve(
    `$I->findElement(${await location.emit(
      target
    )})->type(${generateSendKeysInput(value)});`
  )
}

function emitSetSpeed() {
  return Promise.resolve(
    ""
  )
}

async function emitStore(value, varName) {
  return Promise.resolve(variableSetter(varName, `${value}`))
}

async function emitStoreAttribute(locator, varName) {
  const attributePos = locator.lastIndexOf('@')
  const elementLocator = locator.slice(0, attributePos)
  const attributeName = locator.slice(attributePos + 1)
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$attribute = $I->findElement(${await location.emit(
        elementLocator
      )})->getAttribute("${attributeName}");`,
    },
    { level: 0, statement: `unset($attribute);` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitStoreJson(json, varName) {
  return Promise.resolve(variableSetter(varName, `JSON.parse('${json}');`))
}

async function emitStoreText(locator, varName) {
  const result = `$I->findElement(${await location.emit(
    locator
  )})->getText();`
  return Promise.resolve(variableSetter(varName, result))
}

async function emitStoreTitle(_, varName) {
  return Promise.resolve(variableSetter(varName, '$I->getTitle()'))
}

async function emitStoreValue(locator, varName) {
  const result = `$I->findElement(${await location.emit(
    locator
  )})->getAttribute("value");`
  return Promise.resolve(variableSetter(varName, result))
}

async function emitStoreWindowHandle(varName) {
  return Promise.resolve(
    variableSetter(varName, '$I->getWindowHandle()')
  )
}

async function emitStoreXpathCount(locator, varName) {
  const result = `count($I->findElements(${await location.emit(
    locator
  )}));`
  return Promise.resolve(variableSetter(varName, result))
}

async function emitSubmit(_locator) {
  return Promise.resolve(
    `$I->submitForm("${_locator}");`
  )
}

async function emitType(target, value) {
  return Promise.resolve(
    `$I->findElement(${await location.emit(
      target
    )})->type(${generateSendKeysInput(value)});`
  )
}

async function emitUncheck(locator) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$element = $I->findElement(${await location.emit(
        locator
      )});`,
    },
    {
      level: 1,
      statement: 'if ($element->isSelected()) $element->click()',
    },
    { level: 0, statement: `unset($element);` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitVerifyChecked(locator) {
  return Promise.resolve(
    `$I->assert($I->findElement(${await location.emit(
      locator
    )})->isSelected());`
  )
}

async function emitVerifyEditable(locator) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$element = $I->findElement(${await location.emit(
        locator
      )});`,
    },
    { level: 1, statement: '$I->assert($element->isEnabled());' },
    { level: 1, statement: 'unset($element);' },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitVerifyElementPresent(locator) {
  const commands = [
    { level: 1, statement: `{` },
    {
      level: 2,
      statement: `$elements = $I->findElements(${await location.emit(
        locator
      )});`,
    },
    { level: 2, statement: '$I->assert(count($elements));' },
    { level: 1, statement: 'unset($elements);' },
    { level: 1, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitVerifyElementNotPresent(locator) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$elements = $I->findElements(${await location.emit(
        locator
      )});`,
    },
    { level: 1, statement: '$I->assert(!count($elements));' },
    { level: 1, statement: 'unset($elements);' },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitVerifyNotChecked(locator) {
  return Promise.resolve(
    `$I->assert(!$I->findElement(${await location.emit(
      locator
    )})->isSelected());`
  )
}

async function emitVerifyNotEditable(locator) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$element = $I->findElement(${await location.emit(
        locator
      )});`,
    },
    { level: 1, statement: '$I->assert(!$element->isEnabled());' },
    { level: 1, statement: 'unset($element);' },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitVerifyNotSelectedValue(locator, expectedValue) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$value = $I->findElement(${await location.emit(
        locator
      )})->getAttribute("value");`,
    },
    {
      level: 1,
      statement: `$I->assert($value !== "${exporter.emit.text(expectedValue)}");`,
    },
    { level: 0, statement: `unset($value);` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitVerifyNotText(locator, text) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$text = $I->findElement(${await location.emit(
        locator
      )})->getText();`,
    },
    { level: 1, statement: `$I->assert($text !== "${exporter.emit.text(text)}");` },
    { level: 0, statement: `unset($text);` },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitVerifySelectedLabel(locator, labelValue) {
  const commands = [
    { level: 0, statement: `{` },
    {
      level: 1,
      statement: `$element = $I->findElement(${await location.emit(
        locator
      )});`,
    },
    {
      level: 1,
      statement:
        '$locator = `option[@value=\'$value\']`;',
    },
    {
      level: 1,
      statement:
        `$selectedText = $element->findElement(By::xpath("${locator}"))->getText()`,
    },
    { level: 1, statement: `$I->assert($selectedText == "${labelValue}");` },
    { level: 1, statement: 'unset($element);' },
    { level: 1, statement: 'unset($locator);' },
    { level: 1, statement: 'unset($selectedText);' },
    { level: 0, statement: `}` },
  ]
  return Promise.resolve({
    commands,
  })
}

async function emitVerifyText(locator, text) {
  const commands = [
    {
      level: 2,
      statement: `$I->assert($I->findElement(${await location.emit(
        locator
      )})->getText() == "${exporter.emit.text(text)}");`,
    },
  ]
  return Promise.resolve({ commands })
}

async function emitVerifyValue(locator, value) {
  const commands = [
    { level: 2, statement: `{` },
    {
      level: 3,
      statement: `$value = $I->findElement("${locator}")->getAttribute("value");`,
    },
    { level: 3, statement: `$I->assert($value == "${value}");` },
    { level: 0, statement: `unset($value);` },
    { level: 2, statement: `}` },
  ]
  return Promise.resolve({ commands })
}

async function emitVerifyTitle(title) {
  return Promise.resolve(`$I->assert($I->getTitle() == "${title}");`)
}

function skip() {
  return Promise.resolve(undefined)
}

async function emitWaitForElementPresent(locator, timeout) {
  return Promise.resolve(
    `$I->waitForElement("${locator}", ${timeout});`
  )
}

async function emitWaitForElementNotPresent(locator, timeout) {
  return Promise.resolve(
      `$I->waitForElementNotPresent("${locator}", ${timeout});`
  )
}

async function emitWaitForElementVisible(locator, timeout) {
  return Promise.resolve(
    `$I->waitForElementVisible("${locator}", ${timeout});`
  )
}

async function emitWaitForElementNotVisible(locator, timeout) {
  return Promise.resolve(
    `$I->waitForElementNotVisible("${locator}", ${timeout});`
  )
}

async function emitWaitForElementEditable(locator, timeout) {
  return Promise.resolve(
    `$I->waitForElementClickable("${locator}", ${timeout});`
  )
}

async function emitWaitForElementNotEditable(locator, timeout) {
  return Promise.resolve(
    `$I->waitForElementNotEditable("${locator}", ${timeout});`
  )
}

async function emitWaitForText(locator, text) {
  const timeout = 30000
  return Promise.resolve(
    `$I->waitForText("${text}", ${timeout}, "${locator}");`
  )
}

export default {
  canEmit,
  emit,
  register,
  extras: { emitWaitForWindow },
}
