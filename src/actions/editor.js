import * as Actions from './constants';

export function setActiveItem(itemId) {
  return {
    type: Actions.SET_ACTIVE_ITEM,
    itemId
  };
}

export function setActivePage(itemId) {
  return {
    type: Actions.SET_ACTIVE_PAGE,
    itemId
  };
}

export function addItem(config, parentItemId, afterItemId = null) {
  return {
    type: Actions.ADD_ITEM,
    config,
    parentItemId,
    afterItemId,
    saveNeeded: true
  };
}

export function changeItemType(config, itemId) {
  return {
    type: Actions.CHANGE_ITEM_TYPE,
    config,
    itemId,
    saveNeeded: true
  };
}

export function updateItem(itemId, attribute, value, language = null) {
  return {
    type: Actions.UPDATE_ITEM,
    itemId,
    attribute,
    value,
    language,
    saveNeeded: true
  };
}

export function setActiveLanguage(language) {
  return {
    type: Actions.SET_ACTIVE_LANGUAGE,
    language
  };
}

export function cancelConfirmation() {
  return {
    type: Actions.CANCEL_CONFIRMATION
  };
}

export function askConfirmation(action) {
  return {
    type: Actions.ASK_CONFIRMATION,
    action
  };
}

export function deleteItem(itemId) {
  return {
    type: Actions.DELETE_ITEM,
    itemId,
    confirm: true,
    saveNeeded: true
  };
}

export function showItemOptions(itemId, isPage = false) {
  return {
    type: Actions.SHOW_ITEM_OPTIONS,
    itemId,
    isPage
  };
}

export function hideItemOptions() {
  return {
    type: Actions.HIDE_ITEM_OPTIONS
  };
}

export function createValueset(forItem = null) {
  return {
    type: Actions.CREATE_VALUESET,
    forItem,
    saveNeeded: true
  };
}

export function createValuesetEntry(valueSetId) {
  return {
    type: Actions.CREATE_VALUESET_ENTRY,
    valueSetId,
    saveNeeded: true
  };
}

export function updateValuesetEntry(valueSetId, index, id, label, language) {
  return {
    type: Actions.UPDATE_VALUESET_ENTRY,
    valueSetId,
    index,
    id,
    label,
    language,
    saveNeeded: true
  };
}

export function deleteValuesetEntry(valueSetId, index) {
  return {
    type: Actions.DELETE_VALUESET_ENTRY,
    valueSetId,
    index,
    confirm: true,
    saveNeeded: true
  };
}

export function loadForm(formId) {
  return {
    type: Actions.LOAD_FORM,
    formId
  };
}

export function setForm(formData) {
  return {
    type: Actions.SET_FORM,
    formData
  };
}

export function saveForm() {
  return {
    type: Actions.SAVE_FORM
  };
}

export function setFormRevision(revision) {
  return {
    type: Actions.SET_FORM_REVISION,
    revision
  };
}

export function setStatus(status) {
  return {
    type: Actions.SET_STATUS,
    status
  };
}

export function setErrors(errors) {
  return {
    type: Actions.SET_ERRORS,
    errors
  };
}

export function showFormOptions() {
  return {
    type: Actions.SHOW_FORM_OPTIONS
  };
}

export function hideFormOptions() {
  return {
    type: Actions.HIDE_FORM_OPTIONS
  };
}

export function showVariables() {
  return {
    type: Actions.SHOW_VARIABLES
  };
}

export function hideVariables() {
  return {
    type: Actions.HIDE_VARIABLES
  };
}

export function setMetadataValue(attribute, value) {
  return {
    type: Actions.SET_METADATA_VALUE,
    attribute,
    value,
    saveNeeded: true
  };
}

export function showChangeId(changeId) {
  return {
    type: Actions.SHOW_CHANGE_ID,
    changeId
  };
}

export function hideChangeId() {
  return {
    type: Actions.HIDE_CHANGE_ID,
  };
}

export function performChangeId(oldId, newId) {
  return {
    type: Actions.PERFORM_CHANGE_ID,
    oldId,
    newId
  };
}

export function createContextVariable() {
  return {
    type: Actions.CREATE_CONTEXT_VARIABLE,
    saveNeeded: true
  };
}

export function createExpressionVariable() {
  return {
    type: Actions.CREATE_EXPRESSION_VARIABLE,
    saveNeeded: true
  };
}

export function deleteVariable(id) {
  return {
    type: Actions.DELETE_VARIABLE,
    id,
    saveNeeded: true,
    confirm: true
  };
}

export function updateVariable(id, attribute, value) {
  return {
    type: Actions.UPDATE_VARIABLE,
    id,
    attribute,
    value,
    saveNeeded: true
  };
}

export function requestPreview() {
  return {
    type: Actions.REQUEST_FORM_PREVIEW
  };
}

export function showPreviewContext() {
  return {
    type: Actions.SHOW_PREVIEW_CONTEXT
  };
}

export function hidePreviewContext() {
  return {
    type: Actions.HIDE_PREVIEW_CONTEXT
  };
}

export function createPreviewSession(language, context = false) {
  return {
    type: Actions.CREATE_PREVIEW_SESSION,
    language,
    context
  };
}

export function redirectPreview(sessionId) {
  return {
    type: Actions.REDIRECT_PREVIEW,
    sessionId
  };
}

export function setContextValue(id, value) {
  return {
    type: Actions.SET_CONTEXT_VALUE,
    id,
    value,
    saveNeeded: true
  };
}

export function downloadForm() {
  return {
    type: Actions.DOWNLOAD_FORM
  };
}

export function createValidation(itemId, language) {
  return {
    type: Actions.CREATE_VALIDATION,
    itemId,
    language,
    saveNeeded: true
  };
}

export function deleteValidation(itemId, index) {
  return {
    type: Actions.DELETE_VALIDATION,
    itemId,
    index,
    saveNeeded: true,
    confirm: true
  };
}

export function updateValidation(itemId, index, attribute, value, language = null) {
  return {
    type: Actions.UPDATE_VALIDATION,
    itemId,
    index,
    attribute,
    value,
    language,
    saveNeeded: true
  };
}

export function showValueSets() {
  return {
    type: Actions.SHOW_VALUESETS
  };
}

export function hideValueSets() {
  return {
    type: Actions.HIDE_VALUESETS
  };
}

export function setGlobalValuesetName(valueSetId, name) {
  return {
    type: Actions.SET_GLOBAL_VALUESET_NAME,
    valueSetId,
    name,
    saveNeeded: true
  };
}

export function showTranslation() {
  return {
    type: Actions.SHOW_TRANSLATION
  };
}

export function hideTranslation() {
  return {
    type: Actions.HIDE_TRANSLATION
  };
}

export function addLanguage(language, copyFrom = null) {
  return {
    type: Actions.ADD_LANGUAGE,
    language,
    copyFrom,
    saveNeeded: true
  };
}

export function addItemProp(itemId, propKey) {
  return {
    type: Actions.ADD_ITEM_PROP,
    itemId,
    propKey,
    saveNeeded: true
  };
}

export function deleteItemProp(itemId, propKey) {
  return {
    type: Actions.DELETE_ITEM_PROP,
    itemId,
    propKey,
    saveNeeded: true,
    confirm: true
  };
}

export function updateItemProp(itemId, propKey, value) {
  return {
    type: Actions.UPDATE_ITEM_PROP,
    itemId,
    propKey,
    value,
    saveNeeded: true
  };
}

export function moveItem(dragIndex, hoverIndex, dragParent, hoverParent, itemId) {
  return {
    type: Actions.MOVE_ITEM,
    dragIndex,
    hoverIndex,
    dragParent,
    hoverParent,
    itemId,
    saveNeeded: true
  };
}
