import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Search} from 'semantic-ui-react';
import _ from 'lodash'

import { getFullName } from "../../helpers/generalHelpers"


class ClientSearch extends Component {

    state = {
        isLoading: false,
        searchResults: [],
        searchValue: ""
    }

    handleClientSearchSelect = (e, { result }) => {
        console.log("selected :", result)
        this.props.setClient(result.id)
        this.setState({
            searchValue: result.title
        })
    }

    // THIS FUNCTION DIRECTLY FROM SEMANTIC DOCS 
    // https://react.semantic-ui.com/modules/search/#types-standard
    handleClientSearchChange = (e, { value }) => {
        const clientsWithTitle = this.props.clients.map(client => {
            return {
                ...client,
                title: getFullName(client)
            }
        })
            
        this.setState({ 
            isLoading: true, 
            searchValue: value 
        })

        setTimeout( () => {
            //If there isn't anything searched for, reset
            if (this.state.searchValue.length < 1) {
       
                this.setState({
                    isLoading: false,
                    searchResults: [],
                    searchValue: ""
                })

            }else {
        
                // otherwise, create regeX and define isMatch function to do comparison
                const re = new RegExp(_.escapeRegExp(this.state.searchValue), 'i')
                const isMatch = (result) => re.test(getFullName(result))
    
                console.log("results are ", _.filter(this.props.clients, isMatch) )

                this.setState({
                    isLoading: false, 
                    searchResults: _.filter(clientsWithTitle, isMatch),
                })
            }

        }, 300)

    }

    render(){
        console.log("renderings, state = ", this.state)
        const {isLoading, searchResults, searchValue} = this.state
        return (
            <Search
                label='Client'
                loading={isLoading}
                onResultSelect={this.handleClientSearchSelect}
                onSearchChange={_.debounce(this.handleClientSearchChange, 500, {
                leading: true,
                })}
                results={searchResults}
                value={searchValue}
                //{...this.props}
            />
        )
    }

}



export default withRouter(ClientSearch)

