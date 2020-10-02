from typing import Optional, Tuple

import elasticsearch
from elasticsearch import Elasticsearch
from fastapi import APIRouter, Depends, HTTPException

from ..database import SessionLocal
from ..models.result import Result
from ..services.search_service import SearchService


router = APIRouter()


# Dependency
def get_es() -> Elasticsearch:
    es, index = SessionLocal()
    try:
        yield (es, index)
    finally:
        es.close()


@router.get('/ping')
def ping():
    return 'ping'

@router.get('/search', response_model=Result)
def search(q: Optional[str]=None, es_info: Tuple[Elasticsearch, str] = Depends(get_es)):
    try:
        search_result = SearchService.search(q, es_info[0], es_info[1])
    except elasticsearch.exceptions.NotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail='Item not found',
            headers={'X-Error': 'There goes my error.'}
        )
    return search_result
