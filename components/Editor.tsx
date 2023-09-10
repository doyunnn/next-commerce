import styled from '@emotion/styled'
import { EditorState } from 'draft-js'
import dynamic from 'next/dynamic'
import { Dispatch, SetStateAction } from 'react'
import { EditorProps } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import Button from './Button'

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  {
    ssr: false,
  },
)
interface IProps {
  editorState: EditorState
  readOnly?: boolean
  noPadding?: boolean
  onSave?: () => void
  onEditorStateChange?: Dispatch<SetStateAction<EditorState | undefined>>
}

const CustomEditor: React.FC<IProps> = ({
  editorState,
  readOnly = false,
  noPadding = false,
  onSave,
  onEditorStateChange,
}) => {
  return (
    <Wrapper readOnly={readOnly} noPadding={noPadding}>
      <Editor
        readOnly={readOnly}
        editorState={editorState}
        toolbarHidden={readOnly}
        toolbarClassName="editoreToolbar-hidden"
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbar={{
          options: ['inline', 'list', 'textAlign', 'link'],
        }}
        localization={{
          locale: 'ko',
        }}
        onEditorStateChange={onEditorStateChange}
      />
      {!readOnly && <Button onClick={onSave}>Save</Button>}
    </Wrapper>
  )
}
export default CustomEditor

const Wrapper = styled.div<{ readOnly: boolean; noPadding: boolean }>`
  ${(props) => (props.noPadding ? '' : 'padding: 16px;')}
  ${(props) =>
    props.readOnly ? '' : `border: 1px solid black; border-radius: 8px;`}
`
