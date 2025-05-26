import Card from '../Card/Card';
import CardsListClasses from './CardsList.module.scss';
import { ConfigProvider, Pagination } from 'antd';
import { useGetPostsQuery } from '../../services/blog-services';
import { useEffect, useState } from 'react';

export default function CardsList() {
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { data = [], isLoading, isError } = useGetPostsQuery(offset);

  useEffect(() => {
    const savedCurrentPage = localStorage.getItem('myComponentCurrentPage');
    if (savedCurrentPage) {
      setCurrentPage(parseInt(savedCurrentPage));
      setOffset((parseInt(savedCurrentPage) - 1) * 5);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myComponentCurrentPage', currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setOffset((page - 1) * 5);
  };

  if (isLoading) {
    return (
      <div className={CardsListClasses.loader}>
        <img src='./img/loader.gif' alt=''></img>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={CardsListClasses.loader}>
        <p className={CardsListClasses.empty}>Сервер не отвечает. Попробуйте позже.</p>
      </div>
    );
  }

  return (
    <div className={CardsListClasses.wrapper}>
      {data.articles && data.articles.length > 0 ? (
        data.articles.map((article) => <Card key={article.slug} {...article} />)
      ) : (
        <p className={CardsListClasses.empty}>Нет статей для отображения.</p>
      )}
      <div className={CardsListClasses.pagination}>
        <ConfigProvider
          theme={{
            components: {
              Pagination: {
                itemBg: '#EBEEF3',
                itemActiveBg: '#1890ff',
              },
            },
            token: {
              colorPrimary: '#FFFFFF',
            },
          }}
        >
          <Pagination
            showSizeChanger={false}
            total={data.articlesCount}
            align='center'
            defaultPageSize={5}
            size='small'
            current={currentPage}
            onChange={handlePageChange}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
