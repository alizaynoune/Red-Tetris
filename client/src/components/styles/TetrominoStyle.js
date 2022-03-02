import styled from "styled-components";

export const TetrominoStyle = styled.div`
    background-color: rgba(
        ${props => props.type[1] !== 'shadow'
        ? props.color
        : '203, 211, 212'
    },
        ${props => props.type[0] === 0 ? 0.3
        : props.type[0] === 'W' ? 1
            : props.type[1] === 'shadow' ? 0.3
                : 0.7});
    
    border: ${props => props.type[0] === 0
        ? "0px" : props.type[1] === 'shadow'
            ? "2px solid"
            : '1px solid'};
    border-bottom-color: rgba(${props => props.color},
        ${props => props.type[1] === 'shadow' ? 1 : 0.4});
    border-right-color: rgba(${props => props.color},
        ${props => props.type[1] === 'shadow' ? 1 : 1});
    border-top-color: rgba(${props => props.color}, 1);
    border-left-color: rgba(${props => props.color},
        ${props => props.type[1] === 'shadow' ? 1 : 0.6});
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
`;