
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {MdDelete} from 'react-icons/md'

export function SortableImage(props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const domain = "/public/uploads/";

    return (
        <div className='image-card' ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img className="image" src={`${domain}${props.url}`} alt="venue-card" />
            <div className="overlay ">
                <MdDelete className="icon" onClick={() => props.handleDelete(props.url)} />
            </div>
        </div>
    );
}