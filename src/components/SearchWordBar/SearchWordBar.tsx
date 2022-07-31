import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector, useDebounce } from 'app/hooks'
import { openModal } from 'features/dict/dictSlice'
import {
    IAutoComplete,
    autoComplete,
    lookUpDict,
} from 'features/dict/dictServices'

const SearchWordBar = () => {
    const dispatch = useAppDispatch()

    const [searchTerm, setSearchTerm] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [showList, setShowList] = useState(false)
    const [autoCompleteList, setAutoCompleteList] = useState<IAutoComplete[]>(
        []
    )

    const dict = useAppSelector((state) => state.dict.dict)

    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    useEffect(() => {
        autoComplete(debouncedSearchTerm).then(setAutoCompleteList)
    }, [debouncedSearchTerm])

    const searchDict = async (word: string) => {
        if (!searchTerm) return

        setIsSearching(true)
        let result = dict.find((d) => d.word === word)
        if (!result) {
            result = await lookUpDict(word)
        }
        setIsSearching(false)

        dispatch(openModal(result))
    }

    const hangleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.currentTarget.value)
    }
    const handleCompleteClick = (event: React.MouseEvent<HTMLElement>) => {
        setShowList(false)
        setSearchTerm(event.currentTarget.innerText)
        searchDict(event.currentTarget.innerText)
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setShowList(false)
        searchDict(searchTerm)
    }
    const handleFocus = () => {
        setShowList(true)
    }
    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setShowList(false)
        }
    }

    return (
        <SearchBar onFocus={handleFocus} onBlur={handleBlur}>
            <Form className="d-flex" onSubmit={handleSubmit}>
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search English"
                    value={searchTerm}
                    onChange={hangleChange}
                />
                <Button variant="outline-success" type="submit">
                    {isSearching ? (
                        <div className="spinner-border spinner-border-sm" />
                    ) : (
                        'Search'
                    )}
                </Button>
            </Form>

            {showList && (
                <SearchList>
                    <ListGroup>
                        {autoCompleteList.map(({ word }) => (
                            <ListGroup.Item
                                action
                                key={word}
                                onClick={handleCompleteClick}
                            >
                                {word}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </SearchList>
            )}
        </SearchBar>
    )
}

export default SearchWordBar

const SearchBar = styled.div({
    position: 'relative',
})

const SearchList = styled.div({
    zIndex: 10,
    position: 'absolute',
    transform: 'translateY(100%)',
    bottom: '-8px',
    width: '100%',
})
