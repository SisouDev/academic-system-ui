import {AsyncPaginate, type LoadOptions} from 'react-select-async-paginate';
import { useId } from 'react';
import type { GroupBase } from 'react-select';

export interface SelectOption {
    value: number;
    label: string;
}

interface AsyncSelectProps {
    placeholder: string;
    loadOptions: LoadOptions<SelectOption, GroupBase<SelectOption>, null>;
    value: SelectOption | null;
    onChange: (option: SelectOption | null) => void;
    [key: string]: unknown;
}
export const AsyncSelect = ({ placeholder, loadOptions, value, onChange, ...props }: AsyncSelectProps) => {
    return (
        <AsyncPaginate
            instanceId={useId()}
            value={value}
            loadOptions={loadOptions}
            onChange={onChange}
            placeholder={placeholder}
            debounceTimeout={500}
            isClearable
            loadingMessage={() => 'A procurar...'}
            noOptionsMessage={({ inputValue }) => (inputValue?.length ?? 0) < 3 ? 'Digite pelo menos 3 caracteres' : 'Nenhum resultado encontrado'}
            {...props}
        />
    );
};