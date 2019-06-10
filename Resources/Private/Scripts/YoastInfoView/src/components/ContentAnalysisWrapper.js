// External generic dependencies
import React, {PureComponent} from 'react';
import styled from "styled-components";
import PropTypes from "prop-types";

// External Yoast dependencies
import ContentAnalysis from "@yoast/analysis-report/ContentAnalysis";
import Modal from "@yoast/components/Modal";
import Collapsible from "@yoast/components/Collapsible";
import KeywordInput from "yoast-components/composites/Plugin/Shared/components/KeywordInput";
import colors from "@yoast/style-guide/colors";
import {__} from "@wordpress/i18n";

// Internal dependencies
import scoreToRating from "yoastseo/src/interpreters/scoreToRating";

const modalStyles = {
    content: {
        bottom: 'auto',
    }
};

const StyledContentAnalysisWrapper = styled.div`
    margin: .2rem 1rem;
    font-size: 13px;
`;

class ContentAnalysisWrapper extends PureComponent {
    static propTypes = {
        modalContainer: PropTypes.object.isRequired,
        isAnalyzing: PropTypes.bool.isRequired,
        allResults: PropTypes.object.isRequired,
        seoResults: PropTypes.object.isRequired,
        readabilityResults: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        focusKeyword: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentMarkerId: '',
            currentMarker: [],
            modalIsOpen: false,
        };
    }

    openModal = () => {
        this.setState({modalIsOpen: true});
    };

    closeModal = () => {
        this.setState({modalIsOpen: false});
    };

    render() {
        const seoRating = this.props.seoResults.score ? scoreToRating(this.props.seoResults.score / 10) : 'none';
        const seoRatingIcon = this.props.isAnalyzing ? 'loading-spinner' : 'seo-score-' + seoRating;
        const seoRatingColor = !this.props.isAnalyzing && seoRating !== 'none' ? seoRating : 'grey';

        const readabilityRating = this.props.readabilityResults.score ? scoreToRating(this.props.readabilityResults.score / 10) : 'none';
        const readabilityRatingIcon = this.props.isAnalyzing ? 'loading-spinner' : 'seo-score-' + readabilityRating;
        const readabilityRatingColor = !this.props.isAnalyzing && readabilityRating !== 'none' ? readabilityRating : 'grey';

        return (
            <div className="yoast-seo__content-analysis-wrapper">
                {this.state.currentMarkerId && (
                    <Modal isOpen={this.state.modalIsOpen} onClose={this.closeModal}
                                modalAriaLabel={this.props.allResults[this.state.currentMarkerId]['text']}
                                appElement={this.props.modalContainer} style={modalStyles}
                                closeIconButton="Close" heading={__('Analysis results', 'yoast-components')}>
                        <strong
                            dangerouslySetInnerHTML={{__html: this.props.allResults[this.state.currentMarkerId]['text']}}/>
                        <ul>
                            {this.state.currentMarker.map((mark) => (
                                <li key={mark._properties.original} className="yoast-seo__mark"
                                    dangerouslySetInnerHTML={{__html: mark._properties.marked}}/>
                            ))}
                        </ul>
                    </Modal>
                )}

                <Collapsible
                    title={__('Focus keyphrase', 'yoast-components')}
                    prefixIcon={{
                        icon: seoRatingIcon,
                        color: colors['$color_' + seoRatingColor],
                        size: "18px"
                    }}
                    prefixIconCollapsed={{
                        icon: seoRatingIcon,
                        color: colors['$color_' + seoRatingColor],
                        size: "18px"
                    }}
                    headingProps={{level: 2, fontSize: '18px'}}
                >
                    <StyledContentAnalysisWrapper>
                        <KeywordInput
                            id="focus-keyphrase"
                            keyword={this.props.focusKeyword}
                            onChange={(value) => this.props.onChange('focusKeyword', value)}
                            onRemoveKeyword={() => this.props.onChange('focusKeyword', '')}
                            label={__('Focus keyphrase', 'yoast-components')}
                            ariaLabel={__('Focus keyphrase', 'yoast-components')}/>

                        <ContentAnalysis
                            {...this.props.seoResults}
                            onMarkButtonClick={(id, marker) => {
                                this.setState({
                                    currentMarkerId: id,
                                    currentMarker: marker,
                                });
                                this.openModal();
                            }}
                            marksButtonStatus={'enabled'}
                        />
                    </StyledContentAnalysisWrapper>
                </Collapsible>

                <Collapsible
                    title={__('Readability analysis', 'yoast-components')}
                    prefixIcon={{
                        icon: readabilityRatingIcon,
                        color: colors['$color_' + readabilityRatingColor],
                        size: '18px'
                    }}
                    prefixIconCollapsed={{
                        icon: readabilityRatingIcon,
                        color: colors['$color_' + readabilityRatingColor],
                        size: '18px'
                    }}
                    headingProps={{level: 2, fontSize: "18px"}}
                >
                    <StyledContentAnalysisWrapper>
                        <ContentAnalysis
                            {...this.props.readabilityResults}
                            onMarkButtonClick={(id, marker) => {
                                this.setState({
                                    currentMarkerId: id,
                                    currentMarker: marker,
                                });
                                this.openModal();
                            }}
                            marksButtonStatus={"enabled"}
                        />
                    </StyledContentAnalysisWrapper>
                </Collapsible>
            </div>
        );
    }
}

export default ContentAnalysisWrapper;
