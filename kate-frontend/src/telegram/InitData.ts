interface InitData {
    query_id?: string;
    user?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        language_code?: string;
        is_premium?: boolean;
    };
    chat?: {
        id: number;
        type: 'private' | 'group' | 'supergroup' | 'channel';
        title?: string;
        username?: string;
    };
    auth_date: number;
    hash: string;
}

export default InitData;