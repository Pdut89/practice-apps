import React, { Component, Fragment } from 'react'
import Router from 'next/router'
import toast from 'just-toasty'

import MenuWrapper from '../../components/MenuWrapper'
import FormContainer from '../../components/FormContainer'
import LinearLoader from '../../components/LinearLoader'
import Input from '../../components/Input'
import Button from '../../components/Button'

import colors from '../../utils/colors'

import { authInitialProps } from '../../utils/auth'
import throttle from '../../utils/throttle'
import { post } from '../../utils/requests'

const styleOverrides = {
  inputLeft: {
    'width': 'calc(30% - 1em)'
  },
  inputRight: {
    'width': 'calc(70% - 1em)'
  },
  btn: {
    'width': '20em'
  }
}

class Edit extends Component {

  static getInitialProps = async (opts) => {
    const auth = authInitialProps(false, true)(opts)
    const {req, query} = opts
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : ''

    try {
      const res = await fetch(`${baseUrl}/api/apps/${query.id}`)
      const json = await res.json()
      return Object.assign({app: json}, auth)
    } catch (err) {
      return Object.assign({}, auth)
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      name: !!props.app ? props.app.name : '',
      description: !!props.app ? props.app.description : '',
    }
  }

  componentDidMount() {
    if(!this.props.app) {
      toast('Could not load this app')
      // Router.back()
    }
  }

  valueStateUpdate = (prop) => (event) => this.setState({ [prop]: event.target.value });

  handleNameChange = this.valueStateUpdate('name')
  handleDescriptionChange = this.valueStateUpdate('description')

  handleSubmit = () => {
    const {name, description, isLoading} = this.state

    if (isLoading) {
      return
    }

    if (!name.length || !description.length) {
      toast('Wait up! Please complete the form')
      return
    }

    this.setState({isLoading: true}, () => {
      // Request here
    })
  }

  render () {
    const { name, description, isLoading } = this.state
    const { app } = this.props

    const cardContent = (<Fragment>
      <Input
        label='Name'
        color={colors.accent}
        containerStyle={styleOverrides.inputLeft}
        onChange={this.handleNameChange}
        helperText="Max of 150 characters"
        value={name}
        maxlength="150"
        disabled={isLoading || !app}
      />
      <Input
        label='Description'
        color={colors.accent}
        containerStyle={styleOverrides.inputRight}
        onChange={this.handleDescriptionChange}
        helperText="Max of 400 characters"
        value={description}
        maxlength="400"
        disabled={isLoading || !app}
      />
    </Fragment>)

    const actionButtons = (<Button
      disabled={isLoading || !app}
      style={styleOverrides.btn}
      onClick={throttle(this.handleSubmit)}
    >
      Update {!!app && app.name}
    </Button>)

    return <MenuWrapper noPadding active='Apps'>
      <LinearLoader visible={isLoading} />
      <FormContainer
        title={!!app ? `Update ${app.name}` : 'Update'}
        cardContent={cardContent}
        actionButtons={actionButtons}
      />
    </MenuWrapper>
  }
}

export default Edit
