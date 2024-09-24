from typing import List
from drain3 import TemplateMiner
from drain3.file_persistence import FilePersistence
from drain3.masking import MaskingInstruction
from drain3.template_miner_config import TemplateMinerConfig
from fastapi import FastAPI 
import time
from pydantic import BaseModel

app = FastAPI()


class LogData(BaseModel):
    lines: List[List[str]]

def getDrainModel():
    persistence = FilePersistence("logPatterns.bin")
    config = TemplateMinerConfig()
    config.profiling_enabled = True
    config.masking_instructions = [
        MaskingInstruction(
            "((?<=[^A-Za-z0-9])|^)([\\-\\+]?\\d+)((?=[^A-Za-z0-9])|$)", "NUM"
        ),
        MaskingInstruction(
            "((?<=[^A-Za-z0-9])|^)(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})((?=[^A-Za-z0-9])|$)",
            "IP",
        ),
    ]

    template_miner = TemplateMiner(persistence, config=config)

    return template_miner

@app.post('/logs')
async def getPatterns(log_data: LogData):
    t1 = time.time()
    template_miner = getDrainModel()
    result = {}
    patterns = {}
    for line in log_data.lines:
        [log_id, log_body] = line
        pattern = template_miner.add_log_message(log_body)
        pattern_id = str(pattern["cluster_id"])
        patterns[pattern_id] = pattern["template_mined"]
        result[log_id] = pattern_id
        
    return {
        "patterns": patterns,
        "result": result,
    }