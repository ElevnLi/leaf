/* Copyright (c) 2020, UW Medicine Research IT, University of Washington
 * Developed by Nic Dobbins and Cliff Spital, CRIO Sean Mooney
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */ 

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { Button, Col, Row, Input, ModalHeader } from 'reactstrap';
import { FaCheckSquare, FaRegEdit } from "react-icons/fa";
import { HelpPage, HelpPageContent, HelpCategoryMap, orderId } from '../../models/Help/Help';
import { Content } from '../../components/Help/Content/Content';
import { resetHelpPageContent } from '../../actions/helpPage';
import { ContentRowEditor } from '../../components/Admin/HelpEditor/ContentRowEditor';
import './AdminHelp.css';
import TextareaAutosize from 'react-textarea-autosize';

// import { AdminHelpContentState, AdminHelpPane } from '../../models/state/AdminHelpState';
import { updateAdminHelpPageContent, deleteHelpPageAndContent, checkIfAdminHelpContentUnsaved } from '../../actions/admin/helpPage';
import { AdminHelpContent, ContentRow, UpdateHelpPageContent, UpdateHelpPageContentDTO } from '../../models/admin/Help';
import { HelpPageContentTState } from '../../models/state/HelpState';
import { TextEditor } from '../../components/Admin/HelpEditor/TextEditor';
import { ConfirmationModalState } from '../../models/state/GeneralUiState';
import { showConfirmationModal } from '../../actions/generalUi';

interface Props {
    categories: HelpCategoryMap;
    currentPage: HelpPage;
    dispatch: any;

    page: AdminHelpContent;
}

interface State {
    disabled: boolean;
    currentCategory: string;
    currentTitle: string;
    // currentContent: Map<orderId, ContentRow>;
    currContent: ContentRow[];
    unsaved: boolean;
}

export class AdminHelp extends React.Component<Props, State> {
    private className = "admin-help"

    constructor(props: Props) {
        super(props);
        
        this.state = {
            disabled: false,
            currentCategory: this.props.page.category,
            currentTitle: this.props.page.title,
            // currentContent: this.loadContentMap(this.props.page.content),
            currContent: this.props.page.content,
            unsaved: false
        }
    }

    public render() {
        const c = this.className;
        const { dispatch } = this.props;
        const { currentCategory, currentTitle, disabled, unsaved, currContent } = this.state;
        const arrowMove = disabled ? {marginLeft: "-30%", transition: "3s", transitionTimingFunction: "ease-in-out"} : {};

        // const contentRows = [...this.state.currentContent.values()];
        // const sortedContentRows = contentRows.sort((a, b) => (a.orderId > b.orderId) ? 1 : -1);

        // console.log(contentRows);

        return (
            <div className={c}>
                <Row className={`${c}-buttons`}>
                    <Col>
                        <IoIosArrowRoundBack
                            className={`${c}-back-arrow`}
                            style={arrowMove}
                            onClick={this.handleContentGoBackClick}>

                            {/* TODO: on hover, show text below */}
                            {/* <span className={`${c}-back-arrow-text`}>
                                Go back
                            </span> */}
                        </IoIosArrowRoundBack>
                    </Col>

                    <Col>
                        <Button className={`${c}-edit-button`} color="secondary" disabled={!disabled} onClick={this.handleUndoChanges}>
                            Undo Changes
                        </Button>

                        <Button className={`${c}-edit-button`} color="success" disabled={!disabled} onClick={this.handleSaveChanges}>
                            Save
                        </Button>

                        <Button className={`${c}-edit-button`} color="danger" disabled={disabled} onClick={this.handleDeleteContent}>
                            Delete
                        </Button>
                    </Col>
                </Row>

                {/* <ReactMarkdown className={`${c}-content-title`} children={category} /> */}
                {/* <ReactMarkdown className={`${c}-content-title`} children={currentPage.title} /> */}

                <div className={`${c}-content-text`}>
                {/* {this.getTitleAndCategory()} */}
                <TextEditor
                // talk to NIC: showing the unsaved button when changes happen
                    text={currentTitle}
                    textHandler={this.handleTitleChange}
                    unsaved={unsaved}
                />

                <TextEditor
                    category={true}
                    text={currentCategory}
                    textHandler={this.handleCategoryChange}
                    unsaved={unsaved}
                />

                {/* {sortedContentRows.map((cr,i) => */}
                {currContent.map((cr,i) =>
                // cr.textContent &&
                    // <div key={i} className={`${c}-content-text`}>
                        <ContentRowEditor
                            key={i}
                            index={i}
                            contentRow={cr}
                            dispatch={dispatch}

                            category={currentCategory}
                            title={currentTitle}
                            contentHandler={this.handleContentChange}
                            newSectionHandler={this.handleNewSection}
                            // newTextSectionHandler={this.handleNewTextSection}
                            // newImageSectionHandler={this.handleNewImageSection}
                        />
                    // </div>
                )}
                </div>
            </div>
        );
    };

    // private loadContentMap = (content: ContentRow[]): Map<orderId, ContentRow> => {
    //     const contentMap = new Map<orderId, ContentRow>();
    //     content.map(c => contentMap.set(c.orderId, c));
        
    //     return contentMap;
    // };

    private loadContentMap = (content: ContentRow[]): ContentRow[] => {
        let cont = [];
        cont = content;
        
        return cont;
    };

    private handleTitleChange = (text: string) => {
        this.setState({ disabled: true, currentTitle: text, unsaved: true});
    };

    private handleCategoryChange = (text: string) => {
        this.setState({ disabled: true, currentCategory: text, unsaved: true});
    };

    private handleContentChange = (val: string, orderId: number, index: number) => {
        const { currContent } = this.state;
        // const k = currentContent.get(orderId);
        const kk = currContent.find((_, i) => i == index);

        if (val) {
            // const v = Object.assign({}, k, { textContent: val }) as ContentRow;
            const vv = Object.assign({}, kk, { textContent: val }) as ContentRow;
            // currentContent.set(orderId, v);
            currContent.splice(index, 1, vv);
        } else {
            // currentContent.delete(orderId);
            currContent.splice(index, 1);
        }
        
        console.log("stateCont:", this.state.currContent);
        console.log("propCont:", this.props.page.content);
        this.setState({ currContent: currContent, disabled: true, unsaved: true });
    };

    private handleUndoChanges = () => {
        this.setState({
            currentCategory: this.props.page.category,
            currentTitle: this.props.page.title,
            // currentContent: this.loadContentMap(this.props.page.content),
            currContent: this.props.page.content,
            disabled: false,
            unsaved: false
        })
    };

    private handleSaveChanges = () => {
        const { dispatch } = this.props;
        const { currentCategory, currentTitle, currContent } = this.state;
        // const updateContent: UpdateHelpPageContent[] = [];
        const updateCurrContent: UpdateHelpPageContent[] = [];

        // [...currentContent.values()].map(c => {
        //     const updatedContent = {
        //         title: currentTitle,
        //         category: currentCategory,
        //         pageId: c.pageId,
        //         orderId: c.orderId,
        //         type: c.type,
        //         textContent: c.textContent,
        //         imageContent: c.imageContent,
        //         imageId: c.imageId
        //     } as UpdateHelpPageContentDTO;
        //     updateContent.push(updatedContent);
        // });

        currContent.map(c => {
            const updatedContent = {
                title: currentTitle,
                category: currentCategory,
                pageId: c.pageId,
                orderId: c.orderId,
                type: c.type,
                textContent: c.textContent,
                imageContent: c.imageContent,
                imageId: c.imageId
            } as UpdateHelpPageContentDTO;
            updateCurrContent.push(updatedContent);
        });

        // dispatch(updateAdminHelpPageContent(updateContent));
        dispatch(updateAdminHelpPageContent(updateCurrContent));
        this.setState({ disabled: false, unsaved: false });
    };

    private handleContentGoBackClick = () => {
        const { dispatch } = this.props;
        const { unsaved } = this.state;
        dispatch(checkIfAdminHelpContentUnsaved(unsaved));
    };

    private handleDeleteContent = () => {
        const { dispatch, currentPage } = this.props;
        const { currentTitle } = this.state;

        const confirm: ConfirmationModalState = {
            body: `Are you sure you want to delete the page, "${currentTitle}"? This will take effect immediately and can't be undone.`,
            header: 'Delete Page',
            onClickNo: () => null,
            onClickYes: () => { dispatch(deleteHelpPageAndContent(currentPage)) },
            show: true,
            noButtonText: `No`,
            yesButtonText: `Yes, Delete Page`
        };
        dispatch(showConfirmationModal(confirm));
    };

    // new section logic
    private handleNewSection = (index: number, contentRow: ContentRow, text: boolean, evt?: React.ChangeEvent<HTMLInputElement>) => {
        const content = this.state.currContent;
        if (text) {
            const con = Object.assign({}, {
                pageId: contentRow.pageId,
                orderId: 0,
                type: 'text',
                textContent: 'NEW SECTION',
                imageContent: '',
                imageId: ''
            }) as ContentRow;
            content.splice(index, 0, con);
            this.setState({ currContent: content, disabled: true, unsaved: true });
        } else {
            const image = evt!.currentTarget.files!.item(0)!;
            const imgId = image.name;
            const reader = new FileReader();
            reader.readAsDataURL(image);

            reader.onload = () => {
                const imageString = reader.result!.toString().split(',')[1];
                const con = Object.assign({}, {
                    pageId: contentRow.pageId,
                    orderId: 0,
                    type: 'image',
                    textContent: '',
                    imageContent: imageString,
                    imageId: imgId
                }) as ContentRow;

                content.splice(index, 0, con);
                this.setState({ currContent: content, disabled: true, unsaved: true });
            };
            evt!.currentTarget.remove();
        };
    };
}

// Uploading files
// https://www.positronx.io/understand-html5-filereader-api-to-upload-image-and-text-files/
// https://stackoverflow.com/questions/7179627/files-input-change-event-fires-only-once