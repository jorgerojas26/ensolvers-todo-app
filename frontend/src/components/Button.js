import { Button, Spinner } from 'reactstrap';
import classnames from 'classnames';

export default ({ children, loading, block, disabled, ...rest }) => (
    <Button {...rest} block={block} disabled={loading || disabled}>
        {loading && (
            <Spinner
                className={classnames({
                    'position-relative': true,
                    'button-style': !block,
                    visible: loading,
                    invisible: !loading,
                })}
                size='sm'
            />
        )}
        {!loading && (
            <span
                className={classnames({
                    invisible: loading,
                    visible: !loading,
                    'span-style': !block,
                })}
            >
                {children}
            </span>
        )}
    </Button>
);
